import {attach, createEvent, sample} from 'effector';

import {$currentDaoId, $walletSelector} from '~/entities/wallet';
import {VoteAction} from '~/shared/api/near';
import {mapMultiVoteOptions} from '~/shared/api/near/contracts/sputnik-dao/map-multi-vote-options';

export interface MultiVoteProps {
  proposalId: number;
  voteAction: VoteAction;
}

export const multiVote = createEvent<MultiVoteProps>();

const multiVoteFx = attach({
  source: {
    currentDaoId: $currentDaoId,
    walletSelector: $walletSelector,
  },
  async effect({currentDaoId, walletSelector}, {proposalId, voteAction}: MultiVoteProps) {
    if (!walletSelector) {
      throw new Error('walletSelector is not initialized');
    }

    const wallet = await walletSelector.wallet();

    return wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: currentDaoId,
          actions: [
            {
              type: 'FunctionCall',
              params: mapMultiVoteOptions(proposalId, voteAction),
            },
          ],
        },
      ],
    });
  },
});

sample({
  clock: multiVote,
  target: multiVoteFx,
});
