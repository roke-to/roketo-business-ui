// Init empty walletSelector instance on app loaded
import {createEffect, createEvent, createStore, sample} from 'effector';

export const initWallet = createEvent();

export const initSolanaInstanceFx = createEffect(
  async () =>
    new Promise((resolve) => {
      setTimeout(() => resolve({}), 1000);
    }),
);

sample({
  clock: initWallet,
  target: initSolanaInstanceFx,
});

export const $accountId = createStore('');
export const $isSignedIn = createStore(false);

// Logout logic
export const logoutClicked = createEvent();

export const $currentDaoId = createStore('');
export const setCurrentDaoId = createEvent<string>();
