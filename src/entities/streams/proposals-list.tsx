import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {$streamProposals} from '~/entities/streams/model';
import {ROUTES} from '~/shared/config/routes';
import {ButtonLink} from '~/shared/ui/components/button-link';
import {Col} from '~/shared/ui/components/col';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

export const ProposalsList = () => {
  const streamProposals = useStore($streamProposals);

  if (streamProposals.length === 0) {
    return null;
  }

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
};
