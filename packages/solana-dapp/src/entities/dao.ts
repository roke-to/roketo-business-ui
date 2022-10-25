import {attach, createStore, sample} from 'effector';

import {$accountId} from '~/entities/wallet';

interface AccountDaoResponse {
  id: string;
}

const $daos = createStore<AccountDaoResponse[]>([]);
export const $daoIds = $daos.map((arr) => arr.map(({id}) => id));

const loadDaosFx = attach({
  source: {
    accountId: $accountId,
  },
  async effect({accountId}) {
    console.log('accountId', accountId);
    return new Promise((resolve) => {
      setTimeout(() => resolve([{id: 'test-test-test'}]), 1000);
    });
  },
});

export const $daosLoading = createStore(true);

sample({
  clock: loadDaosFx.doneData,
  fn: () => false,
  target: $daosLoading,
});
