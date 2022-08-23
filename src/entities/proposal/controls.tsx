import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';

import {getVotesStatistic} from '~/entities/proposal/lib/getVotesStatistic';
import styles from '~/entities/proposal/ui/votes/votes.module.css';
import {$accountId} from '~/entities/wallet';
import {Proposal} from '~/shared/api/astro';
import {VoteAction} from '~/shared/api/near';
import {Control} from '~/shared/ui/components/control';
import {Row} from '~/shared/ui/components/row';
import {ReactComponent as Minus} from '~/shared/ui/icons/minus.svg';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';

export const Controls = ({
  isVotable,
  votes,
  className,
  handleVoteAction,
}: {
  isVotable: boolean;
  votes: Proposal['votes'];
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

  const disabled = !isVotable || Boolean(votesStatistic[accountId]);

  return (
    <Row
      justify='start'
      gap={4}
      className={clsx(
        {
          [styles.controls]: isVotable && !isViewMode,
          [styles.votePeriodEnd]: !isVotable && !isViewMode,
        },
        className,
      )}
    >
      <Control
        text={voteYes}
        icon={Plus}
        variant='positive'
        hasActiveVote={yesVote}
        onClick={handleApproveVoteAction}
        disabled={disabled}
      />
      <Control
        text={voteNo}
        icon={Minus}
        variant='negative'
        hasActiveVote={noVote}
        onClick={handleRejectVoteAction}
        disabled={disabled}
      />
    </Row>
  );
};
