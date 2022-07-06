import {attach, createEffect, createEvent, createStore, sample} from 'effector';
import {Get} from 'type-fest';

import {createNearInstance, initWalletSelector, NearInstance, WalletId} from '~/shared/api/near';
import {env} from '~/shared/config/env';

import {ModuleState, WalletSelector, WalletSelectorState} from '@near-wallet-selector/core';

// initWalletSelector is async and it could be null until intialized
const $walletSelector = createStore<WalletSelector | null>(null);
export const $walletSelectorState = createStore<WalletSelectorState>({
  contract: null,
  modules: [],
  accounts: [],
  selectedWalletId: null,
});
const $near = createStore<NearInstance | null>(null);

// Init empty walletSelector instance on app loaded
export const initWallet = createEvent();

const setWalletSelectorState = createEvent<WalletSelectorState>();

let walletSelectorStoreSubscription: ReturnType<Get<WalletSelector, 'store.observable.subscribe'>>;

export const initWalletSelectorFx = createEffect(async () => {
  const walletSelector = await initWalletSelector();

  if (!walletSelectorStoreSubscription) {
    walletSelectorStoreSubscription = walletSelector.store.observable.subscribe((state) => {
      setWalletSelectorState(state);
    });
  }

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
export const $accountId = $walletSelectorState.map(({accounts}) => accounts[0]?.accountId ?? null);
export const $isSignedIn = $walletSelectorState.map(({accounts}) => Boolean(accounts.length));

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

export const initNearInstanceFx = attach({
  source: $walletSelectorState,
  async effect({selectedWalletId}) {
    return createNearInstance(selectedWalletId as WalletId);
  },
});

// Choose some wallet and click it
sample({
  clock: walletClicked,
  target: loginViaWalletFx,
});

// TODO: remove createNearInstance logic, when walletSelector expose account
// now this logic is necessary to get an account for the "Сontract"
sample({
  clock: initWalletSelectorFx.doneData,
  target: initNearInstanceFx,
});
sample({
  clock: initNearInstanceFx.doneData,
  target: $near,
});

// Logout logic
export const logoutClicked = createEvent();

const logoutFromWalletFx = attach({
  source: $walletSelectorState,
  async effect({modules, selectedWalletId}) {
    try {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';

      const error = new Error(`Failed to sign out: ${message}`) as Error & {originalError: unknown};

      error.originalError = err;

      throw err;
    }
  },
});

sample({
  clock: logoutClicked,
  target: logoutFromWalletFx,
});
