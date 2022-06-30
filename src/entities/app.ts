import {createEvent, createStore, sample} from 'effector';

import {initWallet} from './wallet';

// TODO: remove
export const $appLoading = createStore(false);

export const initApp = createEvent();

sample({
  clock: initApp,
  target: initWallet,
});
