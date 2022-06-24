import {createEffect, createEvent, createStore, sample} from 'effector';

import {getAccountDaos as getAccountDaosApi} from '~/shared/api/astro-api';
import {createNearInstance, NearInstance} from '~/shared/api/near';
import {initSputnikFactory} from '~/shared/api/sputnik-factory-dao';

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

const createSputnikFx = createEffect((nearInstance: NearInstance | null) =>
  nearInstance ? initSputnikFactory({account: nearInstance.auth.account}) : null,
);

sample({
  clock: createDao,
  source: createNearWalletFx.doneData,
  target: createSputnikFx,
});

export const getAccountDaos = createEvent();

const getAccountDaosFx = createEffect(async (nearInstance: NearInstance | null) => {
  if (nearInstance) {
    const daos = await getAccountDaosApi(nearInstance.auth.accountId);

    console.log(daos);
  }
});

sample({
  clock: getAccountDaos,
  source: createNearWalletFx.doneData,
  target: getAccountDaosFx,
});
