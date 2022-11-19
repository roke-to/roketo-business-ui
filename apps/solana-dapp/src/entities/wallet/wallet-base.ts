import {attach, createEffect, createEvent, createStore, sample} from '@roketo/core/lib/effector';
import type {SolanaMobileWalletAdapter} from '@solana-mobile/wallet-adapter-mobile';
import {
  Adapter,
  MessageSignerWalletAdapterProps,
  SignerWalletAdapterProps,
  WalletAdapter,
  WalletAdapterProps,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import {PublicKey} from '@solana/web3.js';

import {
  $adapter,
  $isUnloadingRef,
  $wallets,
  handleConnect,
  handleConnectAdapterEvent,
  handleDisconnectAdapterEvent,
  handleErrorAdapterEvent,
  handleAutoConnectRequest as onAutoConnectRequest,
  handleAutoConnectRequestFx as onAutoConnectRequestFx,
  handleConnectError as onConnectError,
  type WalletLocal,
} from './wallet';

const $isConnectingRef = createStore<boolean>(false);
const changeIsConnectingRef = createEvent<boolean>();

sample({
  clock: changeIsConnectingRef,
  target: $isConnectingRef,
});

const $connecting = createStore<boolean>(false);
const changeConnecting = createEvent<boolean>();

sample({
  clock: changeConnecting,
  target: $connecting,
});

const $isDisconnectingRef = createStore<boolean>(false);
const changeIsDisconnectingRef = createEvent<boolean>();

sample({
  clock: changeIsDisconnectingRef,
  target: $isDisconnectingRef,
});

const $disconnecting = createStore<boolean>(false);
const changeDisconnecting = createEvent<boolean>();

sample({
  clock: changeDisconnecting,
  target: $disconnecting,
});

const $publicKey = createStore<PublicKey | null>(null);
sample({
  source: $adapter,
  fn: (adapter) => adapter?.publicKey ?? null,
  target: $publicKey,
});

const $connected = $adapter.map((adapter) => adapter?.connected ?? false);

const handleErrorRef = createEvent<{
  error: WalletError;
  adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null;
}>();
const handleErrorRefFx = createEffect(
  (
    {isUnloadingRef}: {isUnloadingRef: boolean},
    {error, adapter}: {error: WalletError; adapter?: Adapter},
  ) => {
    if (!isUnloadingRef) {
      console.error(error, adapter);
      if (error instanceof WalletNotReadyError && typeof window !== 'undefined' && adapter) {
        window.open(adapter.url, '_blank');
      }
    }
    return error;
  },
);

sample({
  source: {
    isUnloadingRef: $isUnloadingRef,
  },
  clock: handleErrorRef,
  target: handleErrorRefFx,
});

const $wallet = createStore<WalletLocal | null>(null);

sample({
  source: $wallets,
  clock: [$adapter, $wallets],
  fn: (wallets, adapter) => wallets.find((wallet) => wallet.adapter === adapter) ?? null,
  target: $wallet,
});

// Setup and teardown event listeners when the adapter changes
sample({
  clock: handleConnectAdapterEvent,
  target: $publicKey,
});
sample({
  clock: handleConnectAdapterEvent,
  fn: () => false,
  target: $isConnectingRef,
});
sample({
  clock: handleConnectAdapterEvent,
  fn: () => false,
  target: $connecting,
});
sample({
  clock: handleConnectAdapterEvent,
  fn: () => false,
  target: $isDisconnectingRef,
});
sample({
  clock: handleConnectAdapterEvent,
  fn: () => false,
  target: $disconnecting,
});

sample({
  clock: handleDisconnectAdapterEvent,
  fn: () => null,
  target: $publicKey,
});
sample({
  clock: handleDisconnectAdapterEvent,
  fn: () => false,
  target: $isConnectingRef,
});
sample({
  clock: handleDisconnectAdapterEvent,
  fn: () => false,
  target: $connecting,
});
sample({
  clock: handleDisconnectAdapterEvent,
  fn: () => false,
  target: $isDisconnectingRef,
});
sample({
  clock: handleDisconnectAdapterEvent,
  fn: () => false,
  target: $disconnecting,
});
sample({
  source: {adapter: $adapter},
  clock: handleErrorAdapterEvent,
  fn: ({adapter}, error) => ({error, adapter}),
  target: handleErrorRef,
});

sample({
  clock: $wallet,
  target: onAutoConnectRequest,
});
sample({
  clock: onAutoConnectRequestFx.pending,
  fn: () => true,
  target: [$isConnectingRef, $connecting],
});
sample({
  clock: onAutoConnectRequestFx.failData,
  // Drop the error. It will be caught by `handleError` anyway.
  target: onConnectError,
});
sample({
  clock: onAutoConnectRequestFx.finally,
  fn: () => false,
  target: [$isConnectingRef, $connecting],
});

// Send a transaction using the provided connection
type SendTransactionParameters = Parameters<WalletAdapterProps['sendTransaction']>;

export const sendTransaction = createEvent<{
  transaction: SendTransactionParameters[0];
  connection: SendTransactionParameters[1];
  options: SendTransactionParameters[2];
}>();

class WalletNotSelectedError extends WalletError {
  name = 'WalletNotSelectedError';
}

const sendTransactionFx = attach({
  source: {adapter: $adapter, connected: $connected},
  effect: async ({adapter, connected}, {transaction, connection, options}) => {
    if (!adapter) {
      const walletNotSelectedError = new WalletNotSelectedError();
      handleErrorRef({error: walletNotSelectedError, adapter});
      throw walletNotSelectedError;
    }
    if (!connected) {
      const walletNotConnectedError = new WalletNotConnectedError();
      handleErrorRef({error: walletNotConnectedError, adapter});
      throw walletNotConnectedError;
    }
    return adapter.sendTransaction(transaction, connection, options);
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
  source: {adapter: $adapter, connected: $connected},
  effect: async ({adapter, connected}, transaction) => {
    if (!adapter || !('signTransaction' in adapter)) {
      const walletNotSelectedError = new WalletNotSelectedError();
      handleErrorRef({error: walletNotSelectedError, adapter});
      throw walletNotSelectedError;
    }

    if (!connected) {
      const walletNotConnectedError = new WalletNotConnectedError();
      handleErrorRef({error: walletNotConnectedError, adapter});
      throw walletNotConnectedError;
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
  source: {adapter: $adapter, connected: $connected},
  effect: async ({adapter, connected}, transactions) => {
    if (!adapter || !('signAllTransactions' in adapter)) {
      const walletNotSelectedError = new WalletNotSelectedError();
      handleErrorRef({error: walletNotSelectedError, adapter});
      throw walletNotSelectedError;
    }

    if (!connected) {
      const walletNotConnectedError = new WalletNotConnectedError();
      handleErrorRef({error: walletNotConnectedError, adapter});
      throw walletNotConnectedError;
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
  source: {adapter: $adapter, connected: $connected},
  effect: async ({adapter, connected}, message) => {
    if (!adapter || !('signMessage' in adapter)) {
      const walletNotSelectedError = new WalletNotSelectedError();
      handleErrorRef({error: walletNotSelectedError, adapter});
      throw walletNotSelectedError;
    }

    if (!connected) {
      const walletNotConnectedError = new WalletNotConnectedError();
      handleErrorRef({error: walletNotConnectedError, adapter});
      throw walletNotConnectedError;
    }

    return adapter.signMessage(message);
  },
});

sample({
  clock: signMessage,
  target: signMessageFx,
});

const handleConnectFx = createEffect(
  async ({wallet}: {wallet: WalletLocal | null}): Promise<void> => {
    if (!wallet) {
      const walletNotSelectedError = new WalletNotSelectedError();
      handleErrorRef({error: walletNotSelectedError, adapter: null});
      throw walletNotSelectedError;
    }

    const {adapter, readyState} = wallet;

    if (!(readyState === WalletReadyState.Installed || readyState === WalletReadyState.Loadable)) {
      const walletNotReadyError = new WalletNotReadyError();
      handleErrorRef({error: walletNotReadyError, adapter});
      throw walletNotReadyError;
    }
    return adapter.connect();
  },
);

sample({
  source: {
    isConnectingRef: $isConnectingRef,
    isDisconnectingRef: $isDisconnectingRef,
    wallet: $wallet,
  },
  clock: handleConnect,
  filter: ({isConnectingRef, isDisconnectingRef, wallet}) =>
    !(isConnectingRef || isDisconnectingRef || wallet?.adapter.connected),
  target: handleConnectFx,
});

sample({
  clock: handleConnectFx.pending,
  fn: () => true,
  target: [$isConnectingRef, $connecting],
});
sample({
  clock: handleConnectFx.failData,
  target: onConnectError,
});
sample({
  clock: handleConnectFx.finally,
  fn: () => false,
  target: [$isConnectingRef, $connecting],
});

const handleDisconnect = createEvent();
const handleDisconnectFx = createEffect(
  async ({adapter}: {adapter: WalletAdapter<string> | SolanaMobileWalletAdapter | null}) =>
    adapter!.disconnect(),
);

sample({
  source: {
    isDisconnectingRef: $isDisconnectingRef,
    adapter: $adapter,
  },
  clock: handleDisconnect,
  filter: ({isDisconnectingRef, adapter}) => !isDisconnectingRef || !adapter,
  target: handleDisconnectFx,
});

sample({
  clock: handleDisconnectFx.pending,
  fn: () => true,
  target: [$isDisconnectingRef, $disconnecting],
});
sample({
  clock: handleDisconnectFx.failData,
  target: onConnectError,
});
sample({
  clock: handleDisconnectFx.finally,
  fn: () => false,
  target: [$isDisconnectingRef, $disconnecting],
});

export const $accountId = $publicKey.map((publicKey) => (publicKey ? publicKey.toBase58() : ''));
export const $isSignedIn = $publicKey.map((publicKey) => !!publicKey);

$accountId.watch((account) => {
  console.log('account', account);
});

// Logout logic
export const logoutClicked = createEvent();
sample({
  clock: logoutClicked,
  target: handleDisconnect,
});

export const $currentDaoId = createStore('');
export const setCurrentDaoId = createEvent<string>();
