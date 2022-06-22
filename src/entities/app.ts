import {createEvent, createStore, sample} from 'effector';

import {$nearWallet, createNearWalletFx, initWallets} from './near-wallet';

export const $isSignedIn = $nearWallet.map((wallet) => wallet?.auth.signedIn ?? false);

export const $appLoading = createStore(true);

export const initApp = createEvent();

sample({
  clock: createNearWalletFx.finally,
  fn: () => false,
  target: $appLoading,
});
sample({
  clock: initApp,
  target: initWallets,
});
