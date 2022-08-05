import clsx from 'clsx';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ASTRO_DATA_SEPARATOR} from '~/entities/proposal/lib';
import {StatusRow} from '~/entities/proposal/ui/status-row';
import {Votes} from '~/entities/proposal/ui/votes';
import {
  ProposalKindSwaggerDto as BaseProposalKindSwaggerDto,
  Proposal as ProposalType,
} from '~/shared/api/astro';
import {formatYoktoValue} from '~/shared/lib/currency';
import {Col} from '~/shared/ui/components/col';
import {Typography} from '~/shared/ui/components/typography';

import styles from './proposal.module.css';

interface ProposalKindSwaggerDto extends BaseProposalKindSwaggerDto {
  amount?: string;
}

interface ImprovedProposalType extends ProposalType {
  kind: ProposalKindSwaggerDto;
}

export interface ProposalProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: ImprovedProposalType;
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
    proposalId,
    voteStatus,
  } = proposal;

  const {t} = useTranslation('proposal');

  const [readableDescription] = description.split(ASTRO_DATA_SEPARATOR);

  const text = `${type} ${formatYoktoValue(amount)} NEAR ${t('from')} ${proposer} ${t(
    'to',
  )} ${receiverId}`;

  const canVote = status !== 'Approved' && status !== 'Failed' && status !== 'Rejected';

  return (
    <div className={clsx(styles.proposal, styles[status])}>
      <Col className={styles.info}>
        <Typography as='span' weight='bold'>
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
          voteStatus={voteStatus}
        />
      </Col>
      <Votes
        proposalId={proposalId}
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
