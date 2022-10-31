import {createEffect, createEvent, createStore, sample} from 'effector';

import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
  SolanaMobileWalletAdapterWalletName,
} from '@solana-mobile/wallet-adapter-mobile';
import {
  Adapter,
  WalletAdapter,
  WalletError,
  WalletName,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import {StandardWalletAdapter} from '@solana/wallet-standard-wallet-adapter-base';
import {PublicKey} from '@solana/web3.js';

import {$rpcEndpoint} from './connection';
import getEnvironment, {Environment} from './getEnvironment';
import getInferredClusterFromEndpoint from './getInferredClusterFromEndpoint';
import {$standardAdapters as $adaptersWithStandardAdapters} from './standard-wallet-adapters';

const $mobileWalletAdapter = createStore<SolanaMobileWalletAdapter | StandardWalletAdapter | null>(
  null,
);

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
  fn({
    standardAdapters: adaptersWithStandardAdapters,
    rpcEndpoint,
  }): StandardWalletAdapter | SolanaMobileWalletAdapter | null {
    if (!getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])) {
      return null;
    }
    const existingMobileWalletAdapter = adaptersWithStandardAdapters.find(
      (adapter) => adapter.name === SolanaMobileWalletAdapterWalletName,
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
});

export const $adaptersWithMobileWalletAdapter = createStore<
  ReadonlyArray<WalletAdapter<string> | SolanaMobileWalletAdapter | StandardWalletAdapter>
>([]);

export interface WalletLocal {
  adapter: WalletAdapter<string> | SolanaMobileWalletAdapter;
  readyState: WalletReadyState;
}

// Wrap adapters to conform to the `Wallet` interface
export const $wallets = $adaptersWithMobileWalletAdapter.map((adapters) =>
  adapters
    .map((adapter) => ({
      adapter,
      readyState: adapter.readyState,
    }))
    .filter(({readyState}) => readyState !== WalletReadyState.Unsupported),
);

// export const setWallets = createEvent<Wallet[]>();
//
// sample({
//   clock: setWallets,
//   target: $wallets,
// });
// When the adapters change, start to listen for changes to their `readyState`
export const handleReadyStateChangeFx = createEffect(
  ({
    prevAdapters,
    adapters,
    wallets,
  }: {
    prevAdapters: ReadonlyArray<
      WalletAdapter<string> | SolanaMobileWalletAdapter | StandardWalletAdapter
    >;
    adapters: ReadonlyArray<
      WalletAdapter<string> | SolanaMobileWalletAdapter | StandardWalletAdapter
    >;
    wallets: WalletLocal[];
  }) => {
    function handleReadyStateChange(this: Adapter, readyState: WalletReadyState) {
      const index = wallets.findIndex(({adapter: adapterInWallet}) => adapterInWallet === this);
      if (index === -1) return wallets;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const {adapter: currentAdapter} = wallets[index]!;

      console.log('handleReadyStateChange readyState', readyState);
      console.log('handleReadyStateChange currentAdapter', currentAdapter);

      // setWallets(
      //   [
      //     ...wallets.slice(0, index),
      //     {adapter: currentAdapter, readyState},
      //     ...wallets.slice(index + 1),
      //   ].filter(
      //     ({readyState: currentWalletReadyState}) =>
      //       currentWalletReadyState !== WalletReadyState.Unsupported,
      //   ),
      // );
    }

    prevAdapters.forEach((prevAdapter) =>
      prevAdapter.off('readyStateChange', handleReadyStateChange, prevAdapter),
    );

    adapters.forEach((standardAdapter) =>
      standardAdapter.on('readyStateChange', handleReadyStateChange, standardAdapter),
    );

    return adapters;
  },
);

sample({
  source: {
    mobileWalletAdapter: $mobileWalletAdapter,
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
    adaptersWithMobileWalletAdapter: $adaptersWithMobileWalletAdapter,
    wallets: $wallets,
  },
  clock: [$mobileWalletAdapter, $adaptersWithStandardAdapters],
  fn({
    mobileWalletAdapter,
    adaptersWithStandardAdapters,
    adaptersWithMobileWalletAdapter,
    wallets,
  }): {
    prevAdapters: ReadonlyArray<
      WalletAdapter<string> | SolanaMobileWalletAdapter | StandardWalletAdapter
    >;
    adapters: ReadonlyArray<
      WalletAdapter<string> | SolanaMobileWalletAdapter | StandardWalletAdapter
    >;
    wallets: WalletLocal[];
  } {
    if (
      mobileWalletAdapter == null ||
      (adaptersWithStandardAdapters as unknown as Adapter[]).indexOf(mobileWalletAdapter) !== -1
    ) {
      return {
        prevAdapters: adaptersWithMobileWalletAdapter,
        adapters: adaptersWithStandardAdapters,
        wallets,
      };
    }
    return {
      prevAdapters: adaptersWithMobileWalletAdapter,
      adapters: [mobileWalletAdapter, ...adaptersWithStandardAdapters],
      wallets,
    };
  },
  target: handleReadyStateChangeFx,
});

sample({
  source: handleReadyStateChangeFx.doneData,
  target: $adaptersWithMobileWalletAdapter,
});

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

  const adaptersWithStandardAdapters =
    $adaptersWithStandardAdapters.getState() as unknown as Adapter[];
  return getIsMobile(adaptersWithStandardAdapters) ? SolanaMobileWalletAdapterWalletName : null;
};

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

export const $isUnloadingRef = createStore<boolean>(false);

export const handleConnectAdapterEvent = createEvent<PublicKey>();
export const handleDisconnectAdapterEvent = createEvent();
export const handleErrorAdapterEvent = createEvent<WalletError>();
const setupEventListenersFx = createEffect(
  ({
    prevAdapter,
    adapter,
  }: {
    prevAdapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
    adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
  }) => {
    if (prevAdapter) {
      prevAdapter.off('connect', handleConnectAdapterEvent);
      prevAdapter.off('disconnect', handleDisconnectAdapterEvent);
      prevAdapter.off('error', handleErrorAdapterEvent);
      // handleDisconnectAdapterEvent();
    }

    if (adapter) {
      adapter.on('connect', handleConnectAdapterEvent);
      adapter.on('disconnect', handleDisconnectAdapterEvent);
      adapter.on('error', handleErrorAdapterEvent);
    }
  },
);

const handleDisconnectFx = createEffect(
  ({
    prevAdapter,
    adapter,
    adaptersWithStandardAdapters,
    walletName,
    isUnloadingRef,
  }: {
    prevAdapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
    adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
    adaptersWithStandardAdapters: readonly StandardWalletAdapter[];
    walletName: WalletName | null;
    isUnloadingRef: boolean;
  }) => {
    if (prevAdapter) {
      prevAdapter.off('disconnect', handleDisconnect);
    }

    if (
      // Selecting a wallet other than the mobile wallet adapter is not
      // sufficient reason to call `disconnect` on the mobile wallet adapter.
      // Calling `disconnect` on the mobile wallet adapter causes the entire
      // authorization store to be wiped.
      prevAdapter &&
      prevAdapter.name !== SolanaMobileWalletAdapterWalletName
    ) {
      prevAdapter.disconnect();
    }

    if (adapter == null) {
      return null;
    }

    function handleDisconnect() {
      if (isUnloadingRef) {
        return;
      }
      if (
        walletName === SolanaMobileWalletAdapterWalletName &&
        getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])
      ) {
        // Leave the adapter selected in the event of a disconnection.
        return;
      }
      setWalletName(null);
    }

    adapter.on('disconnect', handleDisconnect);

    return adapter;
  },
);

sample({
  clock: handleDisconnectFx.doneData,
  target: $adapter,
});

sample({
  source: {
    adapter: $adapter,
    adaptersWithMobileWalletAdapter: $adaptersWithMobileWalletAdapter,
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
    walletName: $walletName,
    isUnloadingRef: $isUnloadingRef,
  },
  clock: [$adaptersWithMobileWalletAdapter, $walletName],
  fn({
    adapter,
    adaptersWithMobileWalletAdapter,
    adaptersWithStandardAdapters,
    walletName,
    isUnloadingRef,
  }) {
    return {
      prevAdapter: adapter,
      adapter: adaptersWithMobileWalletAdapter.find((a) => a.name === walletName) ?? null,
      adaptersWithStandardAdapters,
      walletName,
      isUnloadingRef,
    };
  },
  target: [handleDisconnectFx, setupEventListenersFx],
});

export const changeIsUnloadingRef = createEvent<boolean>();

sample({
  clock: changeIsUnloadingRef,
  target: $isUnloadingRef,
});

const $autoConnect = createStore(true);
export const changeAutoConnect = createEvent<boolean>();
sample({
  clock: changeAutoConnect,
  target: $autoConnect,
});

export const handleAutoConnectRequest = createEvent();

export const handleAutoConnectRequestFx = createEffect(
  ({
    adapter,
    adaptersWithStandardAdapters,
    walletName,
  }: {
    adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
    adaptersWithStandardAdapters: readonly StandardWalletAdapter[];
    walletName: WalletName | null;
  }): (() => Promise<void>) => {
    // Existence 'adapter' and  autoConnect === true was checked in filter
    if (
      walletName === SolanaMobileWalletAdapterWalletName &&
      getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])
    ) {
      return (
        adapter as SolanaMobileWalletAdapter
      ).autoConnect_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.bind(adapter);
    }
    return adapter!.connect.bind(adapter);
  },
);

sample({
  source: {
    adapter: $adapter,
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
    walletName: $walletName,
    autoConnect: $autoConnect,
  },
  clock: handleAutoConnectRequest,
  filter: ({adapter, autoConnect}) => autoConnect && Boolean(adapter),
  target: handleAutoConnectRequestFx,
});

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

const handleBeforeUnloadFx = createEffect(
  ({
    adaptersWithStandardAdapters,
    walletName,
  }: {
    adaptersWithStandardAdapters: readonly StandardWalletAdapter[];
    walletName: WalletName | null;
  }) => {
    if (
      walletName === SolanaMobileWalletAdapterWalletName &&
      getIsMobile(adaptersWithStandardAdapters as unknown as Adapter[])
    ) {
      changeIsUnloadingRef(false);
    }
  },
);

sample({
  source: {
    adaptersWithStandardAdapters: $adaptersWithStandardAdapters,
    walletName: $walletName,
  },
  clock: [$adaptersWithStandardAdapters, $walletName],
  target: handleBeforeUnloadFx,
});

export const handleConnectError = createEvent();

const handleConnectErrorFx = createEffect(
  ({adapter}: {adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null}) => {
    if (adapter && adapter.name !== SolanaMobileWalletAdapterWalletName) {
      // If any error happens while connecting, unset the adapter.
      setWalletName(null);
    }
  },
);

sample({
  source: {
    adapter: $adapter,
  },
  clock: handleConnectError,
  target: handleConnectErrorFx,
});
