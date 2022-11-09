import {
  $accountId, // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $connection, // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendTransaction, // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signAllTransactions, // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signMessage, // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signTransaction,
} from '~/entities/wallet';

import {attach, createStore, sample} from '@roketo/core/lib/effector';

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

export const $daosLoading = createStore(false);

sample({
  clock: loadDaosFx.doneData,
  fn: () => false,
  target: $daosLoading,
});
