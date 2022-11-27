import {createEffect, createEvent, createStore, sample} from '@roketo/core/lib/effector';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {clusterApiUrl, Connection} from '@solana/web3.js';

export const $connection = createStore<Connection | null>(null);
export const $rpcEndpoint = $connection.map((connection) =>
  connection ? connection.rpcEndpoint : null,
);
export const changeConnectionEndpoint = createEvent<WalletAdapterNetwork>();

export const setupConnectionFx = createEffect(
  (endpoint: string) => new Connection(endpoint, {commitment: 'confirmed'}),
);

sample({
  clock: changeConnectionEndpoint,
  fn: (network) => clusterApiUrl(network),
  target: setupConnectionFx,
});
sample({
  clock: setupConnectionFx.doneData,
  target: $connection,
});

// //ConnectionProvider
