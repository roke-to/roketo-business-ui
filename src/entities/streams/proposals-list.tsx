import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';
import {$streamProposals} from '~/entities/streams/model';
import {ROUTES} from '~/shared/config/routes';
import {ButtonLink} from '~/shared/ui/components/button-link';
import {Col} from '~/shared/ui/components/col';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import {CreateStreamProposalButton} from './create-stream-proposal-button';

interface ProposalsListProps {
  variant?: 'full' | 'preview';
  isDefaultFiltersValue?: boolean;
}

export const ProposalsList = ({variant = 'full', isDefaultFiltersValue}: ProposalsListProps) => {
  const streamProposals = useStore($streamProposals);

  if (variant === 'preview' && streamProposals.length === 0) {
    return null;
  }
  if (variant === 'full' && streamProposals.length === 0) {
    return (
      <EmptyProposalList
        isDefaultFiltersValue={isDefaultFiltersValue}
        createProposalComponent={<CreateStreamProposalButton />}
      />
    );
  }
  if (variant === 'preview') {
    return (
      <Col gap='md'>
        <Row align='center' justify='between'>
          <Typography as='span' font='heading'>
            Last stream proposals
          </Typography>
          <ButtonLink size='sm' to={ROUTES.streamProposals.path}>
            View all stream proposals
          </ButtonLink>
        </Row>
        {streamProposals.slice(0, 2).map((proposal) => (
          <Proposal key={proposal.id} proposal={proposal} />
        ))}
      </Col>
    );
  }

  return (
    <Col gap='md'>
      {streamProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </Col>
  );
};
