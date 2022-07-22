import React from 'react';

import {Proposal} from '~/shared/api/astro';
import {formatISODate, toMilliseconds} from '~/shared/lib/dateFormat';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Clock} from '~/shared/ui/icons/clock.svg';
import {Controls} from '~/widgets/proposal/controls';
import {useCountdown} from '~/widgets/proposal/hooks/useCountDown';
import {isPositiveStatus} from '~/widgets/proposal/lib';
import styles from '~/widgets/proposal/ui/proposal.module.css';

export const StatusRow = ({
  status,
  votes,
  canVote,
  votePeriodEnd,
  updatedAt,
}: {
  status: Proposal['status'];
  votes: Proposal['votes'];
  canVote: boolean;
  votePeriodEnd: number;
  updatedAt: string;
}) => {
  /* это 💩, потому что votePeriodEnd типизируется в апи как number, а приходит string */
  const readableVotePeriodEnd = useCountdown(toMilliseconds(votePeriodEnd as unknown as string));

  return canVote ? (
    <Row gap={2} align='center'>
      <Clock />
      <Typography as='span'>{readableVotePeriodEnd}</Typography>
      <Controls votes={votes} canVote={canVote} className={styles.canVoteViewControls} />
    </Row>
  ) : (
    <Row gap={2} align='center' className={styles.voteStatusBar}>
      <Typography
        as='span'
        color={isPositiveStatus(status) ? 'positive' : 'negative'}
        weight='bold'
      >
        {status} {formatISODate(updatedAt, 'dd MMMM yyyy')}
      </Typography>
      <Controls votes={votes} canVote={canVote} />
    </Row>
  );
};
