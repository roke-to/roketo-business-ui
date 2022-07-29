import {createEvent, createStore, sample} from 'effector';

import {createWalletSelectorInstanceFx, initWallet} from './wallet';

// TODO: remove
export const $appLoading = createStore(true);

export const initApp = createEvent();

sample({
  clock: initApp,
  target: initWallet,
});
sample({
  clock: createWalletSelectorInstanceFx.doneData,
  fn: () => false,
  target: $appLoading,
});
