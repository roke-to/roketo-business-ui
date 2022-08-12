import React from 'react';
import {useTranslation} from 'react-i18next';

import {Controls} from '~/entities/proposal/controls';
import {useCountdown} from '~/entities/proposal/hooks/useCountDown';
import {isPositiveStatus} from '~/entities/proposal/lib';
import {Proposal} from '~/shared/api/astro';
import {formatISODate, toMilliseconds} from '~/shared/lib/dateFormat';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Clock} from '~/shared/ui/icons/clock.svg';

import styles from '../proposal.module.css';

export const StatusRow = ({
  status,
  votes,
  canVote,
  votePeriodEnd,
  updatedAt,
  voteStatus,
}: {
  status: Proposal['status'];
  votes: Proposal['votes'];
  canVote: boolean;
  votePeriodEnd: number;
  updatedAt: string;
  voteStatus: Proposal['voteStatus'];
}) => {
  const {t} = useTranslation('proposal');
  /* это 💩, потому что votePeriodEnd типизируется в апи как number, а приходит string */
  const readableVotePeriodEnd = useCountdown(toMilliseconds(votePeriodEnd as unknown as string));

  const timeText =
    voteStatus === 'Expired' ? (
      <Typography as='span'>{t('timeExpired')}</Typography>
    ) : (
      <>
        <Clock />
        <Typography as='span'>{readableVotePeriodEnd}</Typography>
      </>
    );

  return canVote ? (
    <Row gap={2} align='center'>
      {timeText}
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
