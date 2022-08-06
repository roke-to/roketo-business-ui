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

const sendTransactionsFx = attach({
  source: {
    accountId: $accountId,
  },
  async effect({accountId}) {
    const {searchParams} = new URL(window.location.toString());
    const transactionHashes = searchParams.get('transactionHashes');
    const errorCode = searchParams.get('errorCode') || undefined;
    if (transactionHashes) {
      const hashes = transactionHashes.split(',');

      return Promise.all(
        hashes.map((hash) =>
          astroApi.transactionControllerSuccess(accountId, {
            transactionHashes: hash,
          }),
        ),
      );
    }

    if (errorCode) {
      return astroApi.transactionControllerSuccess(accountId, {
        errorCode,
      });
    }
  },
});

const clearUrlFx = createEffect(() => {
  const {pathname} = new URL(window.location.toString());
  history.replace(pathname);
});

sample({
  clock: $accountId,
  target: sendTransactionsFx,
});

sample({
  clock: sendTransactionsFx.finally,
  target: clearUrlFx,
});
