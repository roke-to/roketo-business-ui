// Init empty walletSelector instance on app loaded
import {attach, createEffect, createEvent, createStore, sample} from 'effector';

import {
  Adapter,
  MessageSignerWalletAdapterProps,
  SignerWalletAdapterProps,
  WalletAdapterProps,
  WalletError,
  WalletName,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import {Wallet} from '@solana/wallet-adapter-react/src/useWallet';
import {PhantomWalletAdapter, SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import {PublicKey} from '@solana/web3.js';

class WalletNotSelectedError extends WalletError {
  name = 'WalletNotSelectedError';
}

export const $walletAdapters = createStore<Adapter[]>([
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
]);

const changeReadyState = createEvent<WalletReadyState>();

export const $wallets = $walletAdapters.map((walletAdapters) =>
  walletAdapters.map((adapter) => {
    adapter.on('readyStateChange', changeReadyState, adapter);

    return {
      adapter,
      readyState: adapter.readyState,
    };
  }),
);

const SOLANA_WALLET_NAME_LOCAL_STORAGE_KEY = `app:solana:walletName`;

export const $selectedWalletName = createStore<WalletName | null>(null);

export const changeSelectedWalletName = createEvent<WalletName | null>();

const changeSelectedWalletNameFx = createEffect((value: WalletName | null) => {
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
  clock: changeSelectedWalletName,
  target: [$selectedWalletName, changeSelectedWalletNameFx],
});

export const initWallet = createEvent();

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
const $adapter = $walletState.map(({adapter}) => adapter);

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

const initWalletFormLocalStorageFx = createEffect((): WalletName | null => {
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
  return null;
});

sample({
  clock: initWallet,
  target: initWalletFormLocalStorageFx,
});

sample({
  source: initWalletFormLocalStorageFx.doneData,
  target: changeSelectedWalletName,
});

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
  clock: changeSelectedWalletName,
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
    params: {isConnecting: boolean; walletState: WalletState; readyState: WalletReadyState},
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
  target: $selectedWalletName,
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
  async ({walletState: {adapter}}: {isDisconnecting: boolean; walletState: WalletState}) => {
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
  clock: changeSelectedWalletName,
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
  target: $selectedWalletName,
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
  target: $selectedWalletName,
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
