import {createEffect, createEvent, createStore, sample} from 'effector';

import {initSputnikV2} from '~/shared/api/near/sputnik-dao';
import {createNearInstance, NearInstance} from '~/shared/api/near/wallet-selector';

export const initWallets = createEvent();

export const $nearWallet = createStore<null | NearInstance>(null);

export const createNearWalletFx = createEffect(() => createNearInstance());

export const $accountId = $nearWallet.map((wallet) => wallet?.auth.accountId ?? null);

sample({
  clock: initWallets,
  target: createNearWalletFx,
});
sample({
  clock: createNearWalletFx.doneData,
  target: $nearWallet,
});

export const $sputnik = createStore<null>(null);

export const createDao = createEvent();

export const createSputnikFx = createEffect((nearInstance: NearInstance | null) =>
  nearInstance ? initSputnikV2({account: nearInstance.auth.account}) : null,
);

sample({
  clock: createDao,
  source: createNearWalletFx.doneData,
  target: createSputnikFx,
});
