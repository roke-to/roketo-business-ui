import {createEvent, createStore, sample} from 'effector';

import {initWallet, initWalletSelectorFx} from './wallet';

// TODO: remove
export const $appLoading = createStore(true);

export const initApp = createEvent();

sample({
  clock: initApp,
  target: initWallet,
});
sample({
  clock: initWalletSelectorFx.doneData,
  fn: () => false,
  target: $appLoading,
});
