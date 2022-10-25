import React from 'react';

import {Councils} from '~/entities/councils';
import {GovernanceProposalsFilters} from '~/entities/governance/ui/proposals-filters';
import {ProposalsList} from '~/entities/governance/ui/proposals-list';
import {sendTransactionsFx} from '~/entities/transactions';

import {Col} from '@roketo/core/ui/components/col';

export const Governance = () => {
  React.useEffect(() => {
    sendTransactionsFx();
  }, []);

  return (
    <Col gap={10}>
      <Councils />
      <Col gap={6}>
        <GovernanceProposalsFilters />
        <ProposalsList />
      </Col>
    </Col>
  );
};
