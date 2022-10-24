import clsx from 'clsx';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {Controls} from '~/entities/proposal/controls';
import {getVotesStatistic} from '~/entities/proposal/lib';
import {multiVote} from '~/entities/proposal/model/proposal';
import {Dao, Proposal} from '~/shared/api/astro';
import {VoteAction} from '~/shared/api/near';
import {formatISODate} from '~/shared/lib/dateFormat';
import {getQuorumValueFromDao} from '~/shared/lib/get-quorum-value';
import {Col} from 'ui/components/col';
import {Thumb, Track} from 'ui/components/range';
import {Row} from 'ui/components/row';
import {Typography} from 'ui/components/typography';

import styles from './votes.module.css';

export const Votes = ({
  proposalId,
  dao,
  status,
  votes,
  numberOfMembers,
  isVotable,
  updatedAt,
  className,
}: {
  proposalId: number;
  dao: Dao;
  status: Proposal['status'];
  votes: Proposal['votes'];
  numberOfMembers: number;
  isVotable: boolean;
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

  const quorum = getQuorumValueFromDao(dao);

  const isPositiveStatusProposal = status === 'InProgress' || status === 'Approved';

  return (
    <Col className={clsx(styles.root, className)}>
      <Col gap={0}>
        <Typography as='span' color='muted' font='xs' isCapitalizeFirstLetter>
          {t('quorum')} {quorum}%
        </Typography>
        <Row gap={0}>
          {!isPositiveStatusProposal && (
            <Typography as='span' color='negative' className={styles.mobileShortText}>
              {status} {formatISODate(updatedAt, 'dd MMMM yyyy')}&nbsp;—&nbsp;
            </Typography>
          )}
          {isPositiveStatusProposal && (
            <Typography as='span' color='positive' isCapitalizeFirstLetter>
              {t(status)}&nbsp;
            </Typography>
          )}
          <Typography as='span' color={isPositiveStatusProposal ? 'positive' : 'negative'}>
            {t('progressStatus', {
              yes: voteYes,
              total: numberOfMembers,
              percent: floorPositivePercent,
            })}
          </Typography>
        </Row>
        <Track value={positivePercent}>
          <Thumb
            className={styles.quorumLine}
            style={{right: `${100 - quorum}%`, left: `${quorum}%`}}
          />
        </Track>
      </Col>

      <Controls isVotable={isVotable} votes={votes} handleVoteAction={handleVoteAction} />
    </Col>
  );
};
