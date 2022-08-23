import {createEvent, createStore, sample} from 'effector';

import {initNearInstanceFx, initWallet} from './wallet';

// TODO: remove
export const $appLoading = createStore(true);

export const initApp = createEvent();

sample({
  clock: initApp,
  target: initWallet,
});
sample({
  // nearInstance intiated after walletSelector
  clock: initNearInstanceFx.doneData,
  fn: () => false,
  target: $appLoading,
});
