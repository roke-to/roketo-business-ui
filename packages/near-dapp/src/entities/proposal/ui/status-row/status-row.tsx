import React from 'react';
import {useTranslation} from 'react-i18next';

import {Controls} from '~/entities/proposal/controls';
import {useCountdown} from '~/entities/proposal/hooks/useCountDown';
import {Proposal} from '~/shared/api/astro';
import {formatISODate, toMilliseconds} from '~/shared/lib/dateFormat';
import {Row} from 'ui/components/row';
import {Typography} from 'ui/components/typography';
import {ReactComponent as Clock} from 'ui/icons/clock.svg';

import styles from '../proposal.module.css';

export const StatusRow = ({
  status,
  votes,
  votePeriodEnd,
  updatedAt,
  voteStatus,
  isVotable,
}: {
  status: Proposal['status'];
  votes: Proposal['votes'];
  votePeriodEnd: number;
  updatedAt: string;
  voteStatus: Proposal['voteStatus'];
  isVotable: boolean;
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

  return status === 'InProgress' ? (
    <Row gap={2} align='center'>
      {timeText}
      <Controls isVotable={isVotable} votes={votes} className={styles.canVoteViewControls} />
    </Row>
  ) : (
    <Row gap={2} align='center' className={styles.voteStatusBar}>
      <Typography as='span' color={status === 'Approved' ? 'positive' : 'negative'} weight='bold'>
        {status} {formatISODate(updatedAt, 'dd MMMM yyyy')}
      </Typography>
      <Controls isVotable={isVotable} votes={votes} />
    </Row>
  );
};
