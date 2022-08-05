import clsx from 'clsx';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {Controls} from '~/entities/proposal/controls';
import {getVotesStatistic, isPositiveStatus} from '~/entities/proposal/lib';
import {multiVote} from '~/entities/proposal/model/proposal';
import {Proposal} from '~/shared/api/astro';
import {VoteAction} from '~/shared/api/near';
import {formatISODate} from '~/shared/lib/dateFormat';
import {Col} from '~/shared/ui/components/col';
import {Thumb, Track} from '~/shared/ui/components/range';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './votes.module.css';

export const Votes = ({
  proposalId,
  status,
  votes,
  numberOfMembers,
  canVote,
  updatedAt,
  className,
}: {
  proposalId: number;
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
  const floorPositivePercent = Math.floor(positivePercent * 10) / 10;

  const handleVoteAction = useCallback(
    (voteAction: VoteAction) => {
      multiVote({proposalId, voteAction});
    },
    [proposalId],
  );

  return (
    <Col className={clsx(styles.root, className)}>
      <Col gap={0}>
        <Typography as='span' color='muted' font='xs' isCapitalizeFirstLetter>
          {t('quorum')} 50%
        </Typography>
        <Row gap={0}>
          {!canVote && (
            <Typography as='span' color='positive' className={styles.mobileShortText}>
              {status} {formatISODate(updatedAt, 'dd MMMM yyyy')}&nbsp;—&nbsp;
            </Typography>
          )}
          {canVote && (
            <Typography as='span' color='positive' isCapitalizeFirstLetter>
              {t('approved')}&nbsp;
            </Typography>
          )}
          <Typography
            as='span'
            color={canVote || isPositiveStatus(status) ? 'positive' : 'negative'}
          >
            {voteYes} {t('of')} {numberOfMembers} ({floorPositivePercent}%)
          </Typography>
        </Row>
        <Track value={positivePercent}>
          <Thumb className={styles.quorumLine} />
        </Track>
      </Col>

      <Controls votes={votes} canVote={canVote} handleVoteAction={handleVoteAction} />
    </Col>
  );
};
