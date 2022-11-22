import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$currentDao} from '~/entities/dao';
import {getReadableProposalTitle} from '~/entities/proposal/lib/get-readable-proposal-title';
import {isVotableProposal} from '~/entities/proposal/lib/is-votable-proposal';
import {StatusRow} from '~/entities/proposal/ui/status-row';
import {Votes} from '~/entities/proposal/ui/votes';
import {$tokenBalances} from '~/entities/treasury/model/treasury';
import {decodeDescription} from '~/shared/api/near/contracts/sputnik-dao/proposal-format';
import {env} from '~/shared/config/env';
import {ImprovedProposalType} from '~/shared/types/proposal.types';

import {$isMobileScreen} from '@roketo/core/effects/screens';
import {ButtonNativeLink} from '@roketo/core/ui/components/button-link';
import {Col} from '@roketo/core/ui/components/col';
import {Line} from '@roketo/core/ui/components/line';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

import styles from './proposal.module.css';

export interface ProposalProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: ImprovedProposalType;
}

export const Proposal = ({proposal}: ProposalProps) => {
  const dao = useStore($currentDao);
  const {
    description: rawDescription,
    votePeriodEnd,
    votes,
    status,
    updatedAt,
    proposalId,
    voteStatus,
    transactionHash,
  } = proposal;

  const {t} = useTranslation('proposal');
  const isMobileScreen = useStore($isMobileScreen);
  const tokenBalances = useStore($tokenBalances);

  const {description, link, variant} = decodeDescription(rawDescription);

  const title = getReadableProposalTitle(proposal, t, tokenBalances, variant);
  const isVotable = isVotableProposal(proposal);

  if (!dao) {
    return null;
  }

  return (
    <div className={clsx(styles.proposal, styles[status])}>
      <Col className={styles.info}>
        <Typography as='span' weight='bold' className='max-w-lg break-all'>
          {title}
        </Typography>
        {description && (
          <Typography as='span' isCapitalizeFirstLetter>
            {t('description')}: {description}
          </Typography>
        )}
        <Row gap='md' className='mobile:flex-col mobile:gap-0'>
          {link && (
            <ButtonNativeLink
              href={link}
              variant={isMobileScreen ? 'outlined' : 'clean'}
              target='_blank'
              rel='noopener noreferrer'
              className={clsx(styles.viewLinkButtonCommon, {
                [styles.viewLinkButton]: !isMobileScreen,
              })}
            >
              {t('viewLink')}
            </ButtonNativeLink>
          )}
          <ButtonNativeLink
            href={`${env.EXPLORER_URL}/transactions/${transactionHash}`}
            variant={isMobileScreen ? 'outlined' : 'clean'}
            target='_blank'
            rel='noopener noreferrer'
            className={clsx(styles.viewLinkButtonCommon, {
              [styles.viewLinkButton]: !isMobileScreen,
            })}
          >
            {t('viewInExplorer')}
          </ButtonNativeLink>
        </Row>
        <StatusRow
          status={status}
          voteStatus={voteStatus}
          votes={votes}
          votePeriodEnd={votePeriodEnd}
          updatedAt={updatedAt}
          isVotable={isVotable}
        />
      </Col>
      <Line className='mobile:hidden' />
      <Votes
        proposalId={proposalId}
        dao={dao}
        status={status}
        votes={votes}
        isVotable={isVotable}
        updatedAt={updatedAt}
        numberOfMembers={dao.numberOfMembers}
        className={styles.votes}
      />
    </div>
  );
};
