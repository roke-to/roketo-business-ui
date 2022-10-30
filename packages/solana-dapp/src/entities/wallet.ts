import {createEffect, createEvent, createStore, sample, attach} from 'effector';

import {
  Adapter,
  WalletAdapter,
  WalletName,
} from '@solana/wallet-adapter-base';

import {StandardWalletAdapter} from "@solana/wallet-standard-wallet-adapter-base";
import {
  createDefaultAddressSelector, createDefaultAuthorizationResultCache, createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
  SolanaMobileWalletAdapterWalletName
} from "@solana-mobile/wallet-adapter-mobile";
import getInferredClusterFromEndpoint from "@solana/wallet-adapter-react/src/getInferredClusterFromEndpoint";
import getEnvironment, {Environment} from "@solana/wallet-adapter-react/src/getEnvironment";

import {$rpcEndpoint} from "./connection";
import {$standardAdapters as $adaptersWithStandardAdapters} from './standard-wallet-adapters';

const $mobileWalletAdapter = createStore<SolanaMobileWalletAdapter | StandardWalletAdapter | null>(null);
export const initWallet = createEvent();

// eslint-disable-next-line @typescript-eslint/naming-convention
let _userAgent: string | null;

function getUserAgent() {
  if (_userAgent === undefined) {
    _userAgent = globalThis.navigator?.userAgent ?? null;
  }
  return _userAgent;
}

function getIsMobile(adapters: Adapter[]) {
  const userAgentString = getUserAgent();
  return getEnvironment({adapters, userAgentString}) === Environment.MOBILE_WEB;
}

function getUriForAppIdentity() {
  const {location} = globalThis;
  if (location == null) {
    return;
  }
  return `${location.protocol}//${location.host}`;
}

sample({
  source: {standardAdapters: $adaptersWithStandardAdapters, rpcEndpoint: $rpcEndpoint},
  clock: [$adaptersWithStandardAdapters, $rpcEndpoint],
  fn({standardAdapters: adaptersWithStandardAdapters, rpcEndpoint}) {
    if (!getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])) {
      return null;
    }
    const existingMobileWalletAdapter = adaptersWithStandardAdapters.find(
      (adapter) => adapter.name === SolanaMobileWalletAdapterWalletName
    );
    if (existingMobileWalletAdapter) {
      return existingMobileWalletAdapter;
    }
    return new SolanaMobileWalletAdapter({
      addressSelector: createDefaultAddressSelector(),
      appIdentity: {
        uri: getUriForAppIdentity(),
      },
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      cluster: getInferredClusterFromEndpoint(rpcEndpoint ?? undefined),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
  },
  target: $mobileWalletAdapter,
})

export const $adaptersWithMobileWalletAdapter = createStore<(WalletAdapter<string> | SolanaMobileWalletAdapter)[]>([])

sample({
  source: {
    mobileWalletAdapter: $mobileWalletAdapter,
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
  },
  clock: [$mobileWalletAdapter, $adaptersWithStandardAdapters],
  fn({mobileWalletAdapter, adaptersWithStandardAdapters}) {
    if (mobileWalletAdapter == null || (adaptersWithStandardAdapters as unknown as Adapter[]).indexOf(mobileWalletAdapter) !== -1) {
      return adaptersWithStandardAdapters;
    }
    return [mobileWalletAdapter, ...adaptersWithStandardAdapters];
  },
  target: $adaptersWithMobileWalletAdapter,
})

const SOLANA_WALLET_NAME_LOCAL_STORAGE_KEY = `app:solana:walletName`;

const getWalletNameFromLocalStorage = (): WalletName | null => {
  try {
    const value = localStorage.getItem(SOLANA_WALLET_NAME_LOCAL_STORAGE_KEY);
    if (value) {
      return JSON.parse(value) as unknown as WalletName;
    }
  } catch (error: any) {
    if (typeof window !== 'undefined') {
      console.error(error);
    }
  }

  const adaptersWithStandardAdapters = $adaptersWithStandardAdapters.getState() as unknown as Adapter[];
  return getIsMobile(adaptersWithStandardAdapters) ? SolanaMobileWalletAdapterWalletName : null;
}

export const $walletName = createStore<WalletName | null>(getWalletNameFromLocalStorage());

export const setWalletName = createEvent<WalletName | null>();

const setWalletNameFx = createEffect((value: WalletName | null) => {
  try {
    if (value === null) {
      localStorage.removeItem(SOLANA_WALLET_NAME_LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(SOLANA_WALLET_NAME_LOCAL_STORAGE_KEY, JSON.stringify(value));
    }
  } catch (error: any) {
    if (typeof window !== 'undefined') {
      console.error(error);
    }
  }
});

sample({
  clock: setWalletName,
  target: [$walletName, setWalletNameFx],
});

export const $adapter = createStore<WalletAdapter<string> | SolanaMobileWalletAdapter | null>(null);

sample({
  source: {
    adaptersWithMobileWalletAdapter: $adaptersWithMobileWalletAdapter,
    walletName: $walletName
  },
  clock: [$adaptersWithMobileWalletAdapter, $walletName],
  fn({adaptersWithMobileWalletAdapter, walletName}) {
    return adaptersWithMobileWalletAdapter.find((a) => a.name === walletName) ?? null
  },
  target: $adapter
})

export const $isUnloadingRef = createStore<boolean>(false);
export const changeIsUnloadingRef = createEvent<boolean>();

sample({
  clock: changeIsUnloadingRef,
  target: $isUnloadingRef,
})

const handleDisconnectFx = createEffect(({adapter, adaptersWithStandardAdapters, walletName, isUnloading}: {
  adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
  adaptersWithStandardAdapters: readonly StandardWalletAdapter[];
  walletName: WalletName | null;
  isUnloading: boolean;
}) => {
  if (adapter == null) {
    return;
  }

  function handleDisconnect() {
    if (isUnloading) {
      return;
    }
    if (walletName === SolanaMobileWalletAdapterWalletName && getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])) {
      // Leave the adapter selected in the event of a disconnection.
      return;
    }
    setWalletName(null);
  }

  adapter.off('disconnect', handleDisconnect);
  adapter.on('disconnect', handleDisconnect);
})

sample({
  source: {
    adapter: $adapter,
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
    walletName: $walletName,
    isUnloading: $isUnloadingRef
  },
  clock: [$adapter, $adaptersWithStandardAdapters, $walletName],
  target: handleDisconnectFx
})

const $autoConnect = createStore(true);
export const changeAutoConnect = createEvent<boolean>();
sample({
  clock: changeAutoConnect,
  target: $autoConnect,
})

export const handleAutoConnectRequest = createEvent();

const handleAutoConnectRequestFx = attach({
  source: {
    adapter: $adapter, adaptersWithStandardAdapters: $adaptersWithStandardAdapters, walletName: $walletName, autoConnect: $autoConnect
  },
  effect: ({adapter, adaptersWithStandardAdapters, walletName, autoConnect}) => {
    if (!autoConnect || !adapter) {
      return;
    }
    if (walletName === SolanaMobileWalletAdapterWalletName && getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])) {
      return (adapter as SolanaMobileWalletAdapter).autoConnect_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.bind(adapter);
    }
    return adapter.connect.bind(adapter);

  }
})

sample({
  clock: handleAutoConnectRequest,
  target: handleAutoConnectRequestFx,
})

// sample({
//   source: {
//     adapter: $adapter,
//   },
//   clock: $adapter,
//   target: // Fire 'disconnect' on adapter
// })

const handleBeforeUnloadFx = createEffect(({
                                             adaptersWithStandardAdapters,
                                             walletName
                                           }: { adaptersWithStandardAdapters: readonly StandardWalletAdapter[], walletName: WalletName | null }) => {
  if (walletName === SolanaMobileWalletAdapterWalletName && getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])) {
    changeIsUnloadingRef(false);
    return;
  }

  function handleBeforeUnload() {
    changeIsUnloadingRef(true);
  }

  /**
   * Some wallets fire disconnection events when the window unloads. Since there's no way to
   * distinguish between a disconnection event received because a user initiated it, and one
   * that was received because they've closed the window, we have to track window unload
   * events themselves. Downstream components use this information to decide whether to act
   * upon or drop wallet events and errors.
   */
  window.addEventListener('beforeunload', handleBeforeUnload);

  // TODO should be remove EventListener
  // window.removeEventListener('beforeunload', handleBeforeUnload);
})

sample({
  source: {
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
    walletName: $walletName
  },
  clock: [$adaptersWithStandardAdapters, $walletName],
  target: handleBeforeUnloadFx,
})

export const handleConnectError = createEvent();

const handleConnectErrorFx = createEffect(({adapter}: { adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null }) => {
  if (adapter && adapter.name !== SolanaMobileWalletAdapterWalletName) {
    // If any error happens while connecting, unset the adapter.
    setWalletName(null);
  }
});

sample({
  source: {
    adapter: $adapter,
  },
  clock: handleConnectError,
  target: handleConnectErrorFx,
})
