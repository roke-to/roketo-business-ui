import {createEffect, createEvent, createStore, sample} from 'effector';

import {initWalletSelector} from '~/shared/api/near';
import {env} from '~/shared/config/env';

import {ModuleState, WalletSelector, WalletSelectorState} from '@near-wallet-selector/core';

export const $walletSelector = createStore<WalletSelector | null>(null);
export const $walletSelectorState = createStore<WalletSelectorState | null>(null);

// Init empty walletSelector instance on app loaded
export const initWallet = createEvent();

const setWalletSelectorState = createEvent<WalletSelectorState>();

const initWalletSelectorFx = createEffect(async () => {
  const walletSelector = await initWalletSelector();

  walletSelector.store.observable.subscribe((state) => {
    setWalletSelectorState(state);
  });

  return walletSelector;
});

// Init empty wallet selector
sample({
  clock: initWallet,
  target: initWalletSelectorFx,
});
sample({
  clock: initWalletSelectorFx.doneData,
  target: $walletSelector,
});

// Update state when it changed
sample({
  clock: setWalletSelectorState,
  target: $walletSelectorState,
});

// Mapped stores shotcuts
export const $accountId = $walletSelector.map(
  (walletSelector) => walletSelector?.store.getState().accounts?.[0].accountId ?? null,
);
export const $isSignedIn = $walletSelector.map(
  (walletSelector) => walletSelector?.isSignedIn() || false,
);

// Login logic
export const walletClicked = createEvent<ModuleState>();

const loginViaWalletFx = createEffect(async (module: ModuleState) => {
  try {
    const wallet = await module.wallet();

    // dont support hardware wallet
    if (wallet.type === 'hardware') {
      return;
    }

    await wallet.signIn({
      contractId: env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME,
    });
  } catch (err) {
    const {name} = module.metadata;

    const message = err instanceof Error ? err.message : 'Something went wrong';

    const error = new Error(`Failed to sign in with ${name}: ${message}`) as Error & {
      originalError: unknown;
    };

    error.originalError = err;

    throw error;
  }
});

// Choose some wallet and click it
sample({
  clock: walletClicked,
  target: loginViaWalletFx,
});

// Logout logic
export const logoutClicked = createEvent();

export const logoutFromWalletFx = attach({
  source: $walletSelector,
  async effect(walletSelector) {
    try {

    if (!walletSelector) {
      return;
    }

    const {modules, selectedWalletId} = walletSelector.store.getState();

    const module = modules.find((m) => m.id === selectedWalletId);

    if (!module) {
      throw new Error(`Wallet ${selectedWalletId} not found`);
    }

    const wallet = await module.wallet();

    // dont support hardware wallet
    if (wallet.type === 'hardware') {
      return;
    }

    await wallet.signOut();

    window.location.reload();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';

    const error = new Error(`Failed to sign out: ${message}`) as Error & {originalError: unknown};

    error.originalError = err;

    throw err;
  }
});

sample({
  clock: logoutClicked,
  target: logoutFromWalletFx,
});
