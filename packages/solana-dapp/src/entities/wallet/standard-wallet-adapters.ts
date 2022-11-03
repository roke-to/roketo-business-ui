import {attach, createEvent, createStore, sample} from 'effector';

import {Adapter} from '@solana/wallet-adapter-base';
import {PhantomWalletAdapter, SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import {
  isWalletAdapterCompatibleWallet,
  StandardWalletAdapter,
} from '@solana/wallet-standard-wallet-adapter-base';
import {DEPRECATED_getWallets} from '@wallet-standard/app';
import {Wallet} from '@wallet-standard/base';

import {setupConnectionFx} from './connection';

function wrapWalletsWithAdapters(
  wallets: ReadonlyArray<Wallet>,
): ReadonlyArray<StandardWalletAdapter> {
  return wallets
    .filter(isWalletAdapterCompatibleWallet)
    .map((wallet) => new StandardWalletAdapter({wallet}));
}

const {get, on} = DEPRECATED_getWallets();
const $on = createStore(on);

const DEFAULT_STANDARD_ADAPTERS = wrapWalletsWithAdapters(get());
export const $standardAdapters = createStore(DEFAULT_STANDARD_ADAPTERS);
const setStandardAdapters = createEvent<ReadonlyArray<StandardWalletAdapter>>();

sample({
  clock: setStandardAdapters,
  target: $standardAdapters,
});

const $listeners = createStore<(() => void)[]>([]);

const changeListenersFx = attach({
  source: {
    listeners: $listeners,
    standardAdapters: $standardAdapters,
  },
  effect: ({listeners, standardAdapters}) => {
    listeners.forEach((destroy) => destroy());

    return [
      on('register', (...wallets) =>
        setStandardAdapters([...standardAdapters, ...wrapWalletsWithAdapters(wallets)]),
      ),
      on('unregister', (...wallets) =>
        setStandardAdapters(
          standardAdapters.filter((standardAdapter) =>
            wallets.some((wallet) => wallet === standardAdapter.wallet),
          ),
        ),
      ),
    ];
  },
});

const setCustomAdapters = createEvent<Adapter[]>();

sample({
  clock: [$on, setupConnectionFx.doneData, $standardAdapters],
  target: changeListenersFx,
});

sample({
  source: changeListenersFx.doneData,
  target: $listeners,
});

sample({
  source: $standardAdapters,
  clock: setCustomAdapters,
  fn(standardAdapters, adapters) {
    return [
      ...standardAdapters,
      ...adapters.filter(({name}) => {
        if (standardAdapters.some((standardAdapter) => standardAdapter.name === name)) {
          console.warn(
            `${name} was registered as a Standard Wallet. The Wallet Adapter for ${name} can be removed from your app.`,
          );
          return false;
        }
        return true;
      }),
    ] as unknown as ReadonlyArray<StandardWalletAdapter>;
  },
  target: setStandardAdapters,
});

setCustomAdapters([new PhantomWalletAdapter(), new SolflareWalletAdapter()]);
