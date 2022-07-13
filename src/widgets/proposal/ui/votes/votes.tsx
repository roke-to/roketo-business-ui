import clsx from 'clsx';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Proposal} from '~/shared/api/astro';
import {formatISODate} from '~/shared/lib/dateFormat';
import {Col} from '~/shared/ui/components/col';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {Controls} from '~/widgets/proposal/controls';
import {getVotesStatistic, isPositiveStatus} from '~/widgets/proposal/lib';

import styles from './votes.module.css';

export const Votes = ({
  status,
  votes,
  numberOfMembers,
  canVote,
  updatedAt,
  className,
}: {
  status: Proposal['status'];
  votes: Proposal['votes'];
  numberOfMembers: number;
  canVote: boolean;
  updatedAt: string;
  className: string;
}) => {
  const {t} = useTranslation('proposal');

  const {voteYes} = getVotesStatistic(votes);

  const positivePercent = (voteYes / numberOfMembers) * 100;
  const negativePercent = 100 - positivePercent;
  const floorPositivePercent = Math.floor(positivePercent * 10) / 10;

  const handleVoteAction = (vote: 'Approve' | 'Reject') => {
    console.log('VOTE', vote);
  };

  return (
    <Col className={clsx(styles.root, className)}>
      <Col gap={0}>
        <Typography as='span' color='muted' weight='medium' isCapitalizeFirstLetter>
          {t('quorum')} 50%
        </Typography>
        <Row gap={0}>
          {!canVote && (
            <Typography
              as='span'
              color='positive'
              weight='medium'
              className={styles.mobileShortText}
            >
              {status} {formatISODate(updatedAt, 'dd MMMM yyyy')}&nbsp;—&nbsp;
            </Typography>
          )}
          {canVote && (
            <Typography as='span' color='positive' weight='medium' isCapitalizeFirstLetter>
              {t('approved')}&nbsp;
            </Typography>
          )}
          <Typography
            as='span'
            color={canVote || isPositiveStatus(status) ? 'positive' : 'negative'}
            weight='medium'
          >
            {voteYes} {t('of')} {numberOfMembers} ({floorPositivePercent}%)
          </Typography>
        </Row>
        <div className={styles.scaleContainer}>
          <div
            style={{width: `${positivePercent}%`}}
            className={clsx(styles.positive, {[styles.scaleFull]: positivePercent === 100})}
          />
          <div
            style={{width: `${negativePercent}%`}}
            className={clsx(styles.negative, {[styles.scaleFull]: negativePercent === 100})}
          />
          <div className={styles.quorumLine} />
        </div>
      </Col>

      <Controls votes={votes} canVote={canVote} handleVoteAction={handleVoteAction} />
    </Col>
  );
};
