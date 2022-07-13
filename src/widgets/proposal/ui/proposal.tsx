import clsx from 'clsx';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Proposal as ProposalType} from '~/shared/api/astro';
import {formatYoktoValue} from '~/shared/lib/currency';
import {Col} from '~/shared/ui/components/col';
import {Typography} from '~/shared/ui/components/typography';
import {ASTRO_DATA_SEPARATOR} from '~/widgets/proposal/lib';
import {StatusRow} from '~/widgets/proposal/ui/status-row';
import {Votes} from '~/widgets/proposal/ui/votes';

import styles from './proposal.module.css';

export interface ProposalProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: ProposalType;
}

export const Proposal = ({proposal}: ProposalProps) => {
  const {
    proposer,
    description,
    votePeriodEnd,
    votes,
    kind: {type, amount = '0', receiverId},
    status,
    dao: {numberOfMembers},
    updatedAt,
  } = proposal;

  const {t} = useTranslation('proposal');

  const [readableDescription] = description.split(ASTRO_DATA_SEPARATOR);

  const text = `${type} ${formatYoktoValue(amount)} NEAR ${t('from')} ${proposer} ${t(
    'to',
  )} ${receiverId}`;

  const canVote = status !== 'Approved' && status !== 'Failed' && status !== 'Rejected';

  return (
    <div className={clsx(styles.proposal, styles[status])}>
      <Col>
        <Typography as='span' weight='semibold'>
          {text}
        </Typography>
        <Typography as='span' isCapitalizeFirstLetter>
          {t('description')}: {readableDescription}
        </Typography>
        <StatusRow
          status={status}
          votes={votes}
          canVote={canVote}
          votePeriodEnd={votePeriodEnd}
          updatedAt={updatedAt}
        />
      </Col>
      <Votes
        status={status}
        votes={votes}
        canVote={canVote}
        updatedAt={updatedAt}
        numberOfMembers={numberOfMembers}
        className={styles.votes}
      />
    </div>
  );
};
