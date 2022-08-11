import {attach, createEffect, createEvent, sample} from 'effector';

import {$sputnikDaoContract} from '~/entities/dao';
import {$accountId} from '~/entities/wallet';
import {astroApi} from '~/shared/api/astro';
import {VoteAction} from '~/shared/api/near';
import {mapMultiVoteOptions} from '~/shared/api/near/contracts/sputnik-dao/map-multi-vote-options';
import {history} from '~/shared/lib/router';

export interface MultiVoteProps {
  proposalId: number;
  voteAction: VoteAction;
}

export const multiVote = createEvent<MultiVoteProps>();

const multiVoteFx = attach({
  source: {
    sputnikDaoContract: $sputnikDaoContract,
  },
  async effect({sputnikDaoContract}, {proposalId, voteAction}: MultiVoteProps) {
    if (!sputnikDaoContract) {
      throw new Error('SputnikDaoContract is not initialized');
    }

    await sputnikDaoContract.act_proposal(mapMultiVoteOptions(proposalId, voteAction));
  },
});

sample({
  clock: multiVote,
  target: multiVoteFx,
});

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
            astroApi.transactionControllerSuccess(accountId, {
              transactionHashes: hash,
            }),
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
