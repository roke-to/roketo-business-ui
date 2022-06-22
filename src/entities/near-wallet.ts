import {createEffect, createEvent, createStore, sample} from 'effector';

import {createNearInstance, NearInstance} from '~/shared/api/near';

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
