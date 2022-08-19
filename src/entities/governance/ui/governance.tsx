import React from 'react';

import {Councils} from '~/entities/councils';
import {GovernanceProposalsFilters} from '~/entities/governance/ui/proposals-filters';
import {ProposalsList} from '~/entities/governance/ui/proposals-list';
import {sendTransactionsFx} from '~/entities/transactions';

export const Governance = () => {
  React.useEffect(() => {
    sendTransactionsFx();
  }, []);

  return (
    <>
      <Councils />
      <GovernanceProposalsFilters />
      <ProposalsList />
    </>
  );
};
