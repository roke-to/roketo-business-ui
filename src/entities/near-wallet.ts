import {createEffect, createEvent, createStore, sample} from 'effector';
import {Near, WalletConnection} from 'near-api-js';

import {createNearInstance, getNearAuth, NearAuth} from '~/shared/api/near';

export const initWallets = createEvent();

export const $nearWallet = createStore<null | {near: Near; auth: NearAuth}>(null);

export const createNearWalletFx = createEffect(async () => {
  const near = await createNearInstance();
  const auth = await getNearAuth(new WalletConnection(near, null));
  return {near, auth};
});

export const $accountId = $nearWallet.map((wallet) => wallet?.auth.accountId ?? null);

sample({
  clock: initWallets,
  target: createNearWalletFx,
});
sample({
  clock: createNearWalletFx.doneData,
  target: $nearWallet,
});
