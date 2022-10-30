import {Wallet} from "@wallet-standard/base";
import {isWalletAdapterCompatibleWallet, StandardWalletAdapter} from "@solana/wallet-standard-wallet-adapter-base";
import {attach, createEvent, createStore, sample} from "effector/effector.cjs";
import {DEPRECATED_getWallets} from "@wallet-standard/app";

function wrapWalletsWithAdapters(wallets: ReadonlyArray<Wallet>): ReadonlyArray<StandardWalletAdapter> {
  return wallets.filter(isWalletAdapterCompatibleWallet).map((wallet) => new StandardWalletAdapter({wallet}));
}

const {get, on} = DEPRECATED_getWallets();
const $on = createStore(on);

const DEFAULT_STANDARD_ADAPTERS = wrapWalletsWithAdapters(get())
export const $standardAdapters = createStore(DEFAULT_STANDARD_ADAPTERS);
const setStandardAdapters = createEvent<ReadonlyArray<StandardWalletAdapter>>();

sample({
  clock: setStandardAdapters,
  target: $standardAdapters,
})

const $listeners = createStore<(() => void)[]>([]);

const changeListenersFx = attach({
  source: {
    listeners: $listeners,
    standardAdapters: $standardAdapters
  },
  effect: ({listeners, standardAdapters}) => {
    listeners.forEach((destroy) => destroy());

    return [
      on('register', (...wallets) =>
        setStandardAdapters([...standardAdapters, ...wrapWalletsWithAdapters(wallets)])
      ),
      on('unregister', (...wallets) => setStandardAdapters(
          standardAdapters.filter((standardAdapter) =>
            wallets.some((wallet) => wallet === standardAdapter.wallet)
          )
        )
      ),
    ]
  }
})

export const setCustomAdapters = createEvent<StandardWalletAdapter[]>();

sample({
  clock: $on,
  target: changeListenersFx,
})

sample({
  source: changeListenersFx.doneData,
  target: $listeners,
})

sample({
  source: $standardAdapters,
  clock: setCustomAdapters,
  fn(standardAdapters, adapters) {
    return [
      ...standardAdapters,
      ...adapters.filter(({name}) => {
        if (standardAdapters.some((standardAdapter) => standardAdapter.name === name)) {
          console.warn(
            `${name} was registered as a Standard Wallet. The Wallet Adapter for ${name} can be removed from your app.`
          );
          return false;
        }
        return true;
      })
    ]
  },
  target: setStandardAdapters,
})
