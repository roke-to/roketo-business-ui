import {attach, createEffect, sample} from 'effector';

import {$accountId} from '~/entities/wallet';
import {astroApi} from '~/shared/api/astro';
import {history} from '~/shared/lib/router';

export const sendTransactionsFx = attach({
  source: {
    accountId: $accountId,
  },
  async effect({accountId}) {
    const searchParams = new URLSearchParams(window.location.search);
    const transactionHashes = searchParams.get('transactionHashes');
    const errorCode = searchParams.get('errorCode');
    const queryKeysToRemove = [];

    try {
      if (transactionHashes) {
        queryKeysToRemove.push('transactionHashes');

        const hashes = transactionHashes.split(',');

        await Promise.all(
          hashes.map((hash) =>
            astroApi.transactionControllerSuccess(
              accountId,
              {
                transactionHashes: hash,
              },
              {
                headers: {
                  'Access-Control-Allow-Origin': 'no-cors',
                },
              },
            ),
          ),
        );
      }

      if (errorCode) {
        queryKeysToRemove.push('errorCode', 'errorMessage');

        await astroApi.transactionControllerSuccess(accountId, {
          errorCode,
        });
      }
    } catch {
      // if it not sended or error,
      // it will be updated from blockchain
    }

    return queryKeysToRemove;
  },
});

const clearUrlFx = createEffect((queryKeysToRemove: string[]) => {
  const url = new URL(window.location.toString());

  queryKeysToRemove.forEach((key) => {
    url.searchParams.delete(key);
  });

  history.replace(url);
});

sample({
  clock: sendTransactionsFx.doneData,
  target: clearUrlFx,
});
