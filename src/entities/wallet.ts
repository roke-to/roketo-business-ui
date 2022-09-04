import {attach, createEffect, createEvent, createStore, sample} from 'effector';
import {Get} from 'type-fest';

import {$keyStore, authenticationRbApiFx} from '~/entities/authentication-rb-api';
import {
  createNearInstance,
  createWalletSelectorInstance,
  NearInstance,
  WalletId,
} from '~/shared/api/near';
import {env} from '~/shared/config/env';

import {ModuleState, WalletSelector, WalletSelectorState} from '@near-wallet-selector/core';

// createWalletSelectorInstance is async and it could be null until intialized
export const $walletSelector = createStore<WalletSelector | null>(null);
export const $walletSelectorState = createStore<WalletSelectorState>({
  contract: null,
  modules: [],
  accounts: [],
  selectedWalletId: null,
});
export const $nearInstance = createStore<NearInstance | null>(null);
export const $account = $nearInstance.map((nearInstance) => nearInstance?.account || null);
export const $wallet = $nearInstance.map((nearInstance) => nearInstance?.wallet || null);

// Init empty walletSelector instance on app loaded
export const initWallet = createEvent();

const setWalletSelectorState = createEvent<WalletSelectorState>();

let walletSelectorStoreSubscription: ReturnType<Get<WalletSelector, 'store.observable.subscribe'>>;

const createWalletSelectorInstanceFx = createEffect(async () => {
  const walletSelector = await createWalletSelectorInstance();

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
  target: createWalletSelectorInstanceFx,
});
sample({
  clock: createWalletSelectorInstanceFx.doneData,
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
  source: {walletSelectorState: $walletSelectorState, keyStore: $keyStore},
  async effect({walletSelectorState: {selectedWalletId}, keyStore}) {
    return createNearInstance(keyStore, selectedWalletId as WalletId);
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
  clock: createWalletSelectorInstanceFx.doneData,
  target: initNearInstanceFx,
});
sample({
  clock: initNearInstanceFx.doneData,
  target: $nearInstance,
});

sample({
  clock: initNearInstanceFx.doneData,
  filter: (near) => Boolean(near.accountId),
  target: authenticationRbApiFx,
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
