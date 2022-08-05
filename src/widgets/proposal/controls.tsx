import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';

import {$accountId} from '~/entities/wallet';
import {Proposal} from '~/shared/api/astro';
import {VoteAction} from '~/shared/api/near';
import {Control} from '~/shared/ui/components/control';
import {Row} from '~/shared/ui/components/row';
import {ReactComponent as Minus} from '~/shared/ui/icons/minus.svg';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';
import {getVotesStatistic} from '~/widgets/proposal/lib';
import styles from '~/widgets/proposal/ui/votes/votes.module.css';

export const Controls = ({
  votes,
  canVote,
  className,
  handleVoteAction,
}: {
  votes: Proposal['votes'];
  canVote: boolean;
  className?: string;
  handleVoteAction?(vote: VoteAction): void;
}) => {
  const accountId = useStore($accountId);

  const {voteYes, voteNo, votes: votesStatistic} = getVotesStatistic(votes);

  const yesVote = votesStatistic[accountId] === 'Yes';
  const noVote = votesStatistic[accountId] === 'No';

  const isViewMode = typeof handleVoteAction === 'undefined';

  const handleApproveVoteAction = isViewMode
    ? undefined
    : () => handleVoteAction(VoteAction.VoteApprove);
  const handleRejectVoteAction = isViewMode
    ? undefined
    : () => handleVoteAction(VoteAction.VoteReject);

  return (
    <Row
      justify='start'
      gap={4}
      className={clsx(
        {
          [styles.controls]: canVote && !isViewMode,
          [styles.votePeriodEnd]: !canVote && !isViewMode,
        },
        className,
      )}
    >
      <Control
        text={voteYes}
        icon={Plus}
        variant='positive'
        active={yesVote}
        onClick={handleApproveVoteAction}
      />
      <Control
        text={voteNo}
        icon={Minus}
        variant='negative'
        active={noVote}
        onClick={handleRejectVoteAction}
      />
    </Row>
  );
};
