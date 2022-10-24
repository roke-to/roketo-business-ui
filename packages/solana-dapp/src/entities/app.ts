import {createEvent, sample, createStore} from 'effector';
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
  target: initWallet,
});
sample({
  // nearInstance intiated after walletSelector
  clock: initSolanaInstanceFx.doneData,
  fn: (): AppState => 'ready',
  target: $appState,
});
