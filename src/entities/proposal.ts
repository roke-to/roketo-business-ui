import {attach, createEvent, sample} from 'effector';

import {$sputnikDaoContract} from '~/entities/dao';
import {Action} from '~/shared/api/near';
import {mapMultiVoteOptions} from '~/shared/api/near/contracts/sputnik-dao/map-multi-vote-options';

export interface MultiVoteProps {
  proposalId: number;
  voteAction: Action;
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
