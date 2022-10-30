import {attach, createEffect, createEvent, createStore, sample} from "effector/effector.cjs";
import {
  Adapter, MessageSignerWalletAdapterProps, SignerWalletAdapterProps, WalletAdapter,
  WalletAdapterProps,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState
} from "@solana/wallet-adapter-base";
import {PhantomWalletAdapter, SolflareWalletAdapter} from "@solana/wallet-adapter-wallets";
import {Wallet} from "@wallet-standard/base";
import {PublicKey} from "@solana/web3.js";
import {
  $adaptersWithMobileWalletAdapter as $adapters,
  $adapter,
  $isUnloadingRef,
  handleAutoConnectRequest as onAutoConnectRequest,
  handleConnectError as onConnectError,
  setWalletName as onSelectWallet
} from "~/entities/wallet";
import {SolanaMobileWalletAdapter} from "@solana-mobile/wallet-adapter-mobile";

const $isConnectingRef = createStore<boolean>(false);
export const changeIsConnectingRef = createEvent<boolean>();

sample({
  clock: changeIsConnectingRef,
  target: $isConnectingRef,
})

const $connecting = createStore<boolean>(false);
export const changeConnecting = createEvent<boolean>();

sample({
  clock: changeConnecting,
  target: $connecting,
})

const $isDisconnectingRef = createStore<boolean>(false);
export const changeIsDisconnectingRef = createEvent<boolean>();

sample({
  clock: changeIsDisconnectingRef,
  target: $isDisconnectingRef,
})

const $disconnecting = createStore<boolean>(false);
export const changeDisconnecting = createEvent<boolean>();

sample({
  clock: changeDisconnecting,
  target: $disconnecting,
})

const $publicKey = $adapter.map((adapter) => adapter?.publicKey ?? null);
const setPublicKey = createEvent<PublicKey | null>();

sample({
  clock: setPublicKey,
  target: $publicKey
})

const $connected = $adapter.map((adapter) => adapter?.connected ?? false);
const setConnected = createEvent<boolean>();

sample({
  clock: setConnected,
  target: $connected
})

interface Wallet_ {
  adapter: WalletAdapter<string> | SolanaMobileWalletAdapter,
  readyState: WalletReadyState
}

// Wrap adapters to conform to the `Wallet` interface
const $wallets = $adapters.map((adapters) => (
  adapters
    .map((adapter) => ({
      adapter,
      readyState: adapter.readyState,
    }))
    .filter(({readyState})=>readyState !== WalletReadyState.Unsupported)
))

const setWallets = createEvent<Wallet_[]>()

sample({
  clock: setWallets,
  target: $wallets,
})
// When the adapters change, start to listen for changes to their `readyState`


interface WalletState {
  wallet: Wallet | null;
  adapter: Adapter | null;
  publicKey: PublicKey | null;
  connected: boolean;
}

const INITIAL_WALLET_STATE = {
  wallet: null,
  adapter: null,
  publicKey: null,
  connected: false,
};

export const $walletState = createStore<WalletState>(INITIAL_WALLET_STATE);

const $readyState = $walletState.map(
  ({adapter}) => adapter?.readyState || WalletReadyState.Unsupported,
);

const $isConnecting = createStore<boolean>(false);
const $isDisconnecting = createStore<boolean>(false);

// IS_UPLOADING ----------------------------------------------------------------------------------- //
const $isUnloading = createStore<boolean>(false);
export const changeIsUnloading = createEvent<boolean>();

sample({
  clock: changeIsUnloading,
  target: $isUnloading,
});
// // IS_UPLOADING ----------------------------------------------------------------------------------- //


// Handle the adapter's connect event
const handleConnect = createEvent<PublicKey>();
// Handle the adapter's disconnect event
const handleDisconnect = createEvent();
// Handle the adapter's error event, and local errors
const handleError = createEvent<WalletError>();

// Setup and teardown event listeners when the adapter changes
const subscribeOnAdapterEventsFx = createEffect((adapter: Adapter) => {
  adapter.on('connect', handleConnect);
  adapter.on('disconnect', handleDisconnect);
  adapter.on('error', handleError);
});

sample({
  source: $adapter,
  filter: Boolean,
  target: subscribeOnAdapterEventsFx,
});

// When the selected wallet changes, initialize the state
const changeSelectedWalletFx = attach({
  source: {currentAdapter: $adapter},
  effect: ({currentAdapter}, wallet) => {
    // When the adapter changes, disconnect the old one
    currentAdapter?.disconnect();
    currentAdapter?.off('connect', handleConnect);
    currentAdapter?.off('disconnect', handleDisconnect);
    currentAdapter?.off('error', handleError);

    return {
      wallet,
      adapter: wallet.adapter,
      connected: wallet.adapter.connected,
      publicKey: wallet.adapter.publicKey,
    };
  },
});

const findWalletByName = (wallets: Wallet[], name: string | null): Wallet | null => {
  if (!name) {
    return null;
  }
  return wallets.find(({adapter}) => adapter.name === name) ?? null;
};

sample({
  source: {wallets: $wallets},
  clock: setWalletName,
  filter: ({wallets}, name) => Boolean(findWalletByName(wallets, name)),
  fn: ({wallets}, name) => findWalletByName(wallets, name),
  target: changeSelectedWalletFx,
});

// If the window is closing or reloading, ignore disconnect and error events from the adapter
window.addEventListener('beforeunload', () => changeIsUnloading(true));

// Handle the adapter's connect event
sample({
  clock: handleConnect,
  source: $walletState,
  fn: (walletState) => {
    console.log('WE HERE !!!!');
    if (!walletState.adapter) {
      return walletState;
    }
    return {
      ...walletState,
      connected: walletState.adapter.connected,
      publicKey: walletState.adapter.publicKey,
    };
  },
  target: $walletState,
});

// Handle the adapter's disconnect event
sample({
  clock: handleDisconnect,
  fn: () => false,
  target: $isUnloading,
});

// Handle the adapter's error event, and local errors
handleError.watch((error) => {
  const isUploading = $isUnloading.getState();
  if (!isUploading) {
    console.error(error);
  }
  return error;
});

const tryAdapterConnectFx = createEffect(
  async (
    params: { isConnecting: boolean; walletState: WalletState; readyState: WalletReadyState },
    adapter: Adapter | null,
  ) => {
    // effector couldn't see that filter return 'true' only if 'adapter' exist
    adapter?.connect();
  },
);

// try to connect when the adapter changes and is ready
sample({
  source: {
    isConnecting: $isConnecting,
    walletState: $walletState,
    readyState: $readyState,
  },
  clock: $adapter,
  filter: ({isConnecting, walletState: {connected}, readyState}, adapter) =>
    !(
      isConnecting ||
      connected ||
      !adapter ||
      !(readyState === WalletReadyState.Installed || readyState === WalletReadyState.Loadable)
    ),
  target: tryAdapterConnectFx,
});

sample({
  clock: tryAdapterConnectFx.pending,
  fn: () => true,
  target: $isConnecting,
});

sample({
  source: tryAdapterConnectFx.failData,
  fn: () => null,
  target: $walletName,
});

sample({
  source: tryAdapterConnectFx.finally,
  fn: () => false,
  target: $isConnecting,
});

// Connect the adapter to the wallet
const connectFx = createEffect(
  async ({
           walletState: {adapter, wallet},
         }: {
    isConnecting: boolean;
    isDisconnecting: boolean;
    walletState: WalletState;
  }) => {
    if (!adapter) {
      throw handleError(new WalletNotSelectedError());
    }

    if (
      !(
        wallet?.readyState === WalletReadyState.Installed ||
        wallet?.readyState === WalletReadyState.Loadable
      )
    ) {
      throw handleError(new WalletNotReadyError());
    }
    return adapter.connect();
  },
);

sample({
  clock: changeSelectedWalletFx.doneData,
  source: {
    isConnecting: $isConnecting,
    isDisconnecting: $isDisconnecting,
    readyState: $readyState,
  },
  filter: ({isConnecting, isDisconnecting}, walletState) =>
    !(isConnecting || isDisconnecting || walletState.connected),
  fn: ({isConnecting, isDisconnecting}, walletState) => ({
    isConnecting,
    isDisconnecting,
    walletState,
  }),
  target: connectFx,
});

sample({
  clock: connectFx.pending,
  fn: () => true,
  target: $isConnecting,
});

sample({
  clock: connectFx.finally,
  fn: () => false,
  target: $isConnecting,
});

// Disconnect the adapter from the wallet
const disconnectFx = createEffect(
  async ({walletState: {adapter}}: { isDisconnecting: boolean; walletState: WalletState }) => {
    if (!adapter) {
      throw handleError(new WalletNotSelectedError());
    }
    return adapter.disconnect();
  },
);

sample({
  source: {
    isDisconnecting: $isDisconnecting,
    walletState: $walletState,
  },
  clock: setWalletName,
  filter: ({isDisconnecting}, name) => !(isDisconnecting || name),
  target: disconnectFx,
});

sample({
  clock: disconnectFx.pending,
  fn: () => true,
  target: $isDisconnecting,
});

sample({
  clock: disconnectFx.failData,
  fn: () => false,
  target: $isDisconnecting,
});

sample({
  clock: disconnectFx.failData,
  fn: () => null,
  target: $walletName,
});

sample({
  clock: disconnectFx.finally,
  fn: () => false,
  target: $isDisconnecting,
});

sample({
  source: {
    walletState: $walletState,
  },
  clock: connectFx.failData,
  filter: (source, error) => error instanceof WalletNotReadyError,
  fn: ({walletState}) => {
    if (typeof window !== 'undefined') {
      window.open(walletState.adapter?.url, '_blank');
    }
    return null;
  },
  target: $walletName,
});

// Send a transaction using the provided connection
type SendTransactionParameters = Parameters<WalletAdapterProps['sendTransaction']>;

export const sendTransaction = createEvent<{
  transaction: SendTransactionParameters[0];
  connection: SendTransactionParameters[1];
  options: SendTransactionParameters[2];
}>();

const sendTransactionFx = attach({
  source: $walletState,
  effect: async (walletState, {transaction, connection, options}) => {
    if (!walletState.adapter) {
      throw handleError(new WalletNotSelectedError());
    }
    if (!walletState.connected) {
      throw handleError(new WalletNotConnectedError());
    }
    return walletState.adapter.sendTransaction(transaction, connection, options);
  },
});

sample({
  clock: sendTransaction,
  target: sendTransactionFx,
});

// Sign a transaction if the wallet supports it
type SignTransactionParameters = Parameters<SignerWalletAdapterProps['signTransaction']>;
export const signTransaction = createEvent<SignTransactionParameters>();

const signTransactionFx = attach({
  source: $walletState,
  effect: async ({adapter, connected}, transaction) => {
    if (!adapter || !('signTransaction' in adapter)) {
      throw handleError(new WalletNotSelectedError());
    }

    if (!connected) {
      throw handleError(new WalletNotConnectedError());
    }

    return adapter.signTransaction(transaction);
  },
});

sample({
  clock: signTransaction,
  target: signTransactionFx,
});

// Sign multiple transactions if the wallet supports it
type SignAllTransactionsParameters = Parameters<SignerWalletAdapterProps['signAllTransactions']>;
export const signAllTransactions = createEvent<SignAllTransactionsParameters>();

const signAllTransactionsFx = attach({
  source: $walletState,
  effect: async ({adapter, connected}, transactions) => {
    if (!adapter || !('signAllTransactions' in adapter)) {
      throw handleError(new WalletNotSelectedError());
    }

    if (!connected) {
      throw handleError(new WalletNotConnectedError());
    }

    return adapter.signAllTransactions(transactions);
  },
});

sample({
  clock: signAllTransactions,
  target: signAllTransactionsFx,
});

// Sign an arbitrary message if the wallet supports it
type SignMessageParameters = Parameters<MessageSignerWalletAdapterProps['signMessage']>;
export const signMessage = createEvent<SignMessageParameters>();

const signMessageFx = attach({
  source: $walletState,
  effect: async ({adapter, connected}, message) => {
    if (!adapter || !('signMessage' in adapter)) {
      throw handleError(new WalletNotSelectedError());
    }

    if (!connected) {
      throw handleError(new WalletNotConnectedError());
    }

    return adapter.signMessage(message);
  },
});

sample({
  clock: signMessage,
  target: signMessageFx,
});

export const $accountId = $walletState.map(({publicKey}) =>
  publicKey ? publicKey.toBase58() : '',
);
export const $isSignedIn = $walletState.map(({publicKey}) => !!publicKey);

$accountId.watch((account) => {
  console.log('account', account);
});
$walletState.watch((walletState) => {
  console.log('$walletState===> ', walletState);
});
// Logout logic
export const logoutClicked = createEvent();

export const $currentDaoId = createStore('');
export const setCurrentDaoId = createEvent<string>();
