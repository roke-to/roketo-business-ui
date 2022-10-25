import {createEvent, createStore, sample} from 'effector';

import {env} from '~/shared/config/env';

import {initSolanaInstanceFx, initWallet} from './wallet';

// TODO: remove

type AppState = 'loading' | 'ready' | 'crashed';

// Near isn't available now. Please, try another time // or another network (mainnet/testnet) // later.

export const $appState = createStore<AppState>('loading');
export const $appLoading = $appState.map(
  (appState) => appState === 'loading' || appState === 'crashed',
);

export const initApp = createEvent();

sample({
  clock: initApp,
  fn: () => {
    console.log('env', env);
  },
  target: initWallet,
});

sample({
  // nearInstance intiated after walletSelector
  clock: initSolanaInstanceFx.doneData,
  fn: (): AppState => 'ready',
  target: $appState,
});

sample({
  // nearInstance intiated after walletSelector
  clock: initSolanaInstanceFx.failData,
  fn: (): AppState => 'crashed',
  target: $appState,
});
