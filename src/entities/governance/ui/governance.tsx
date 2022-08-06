import React from 'react';

import {Councils} from '~/entities/councils';
import {loadGovernanceProposals} from '~/entities/governance/model';
import {GovernanceProposalsFilters} from '~/entities/governance/ui/proposals-filters';
import {ProposalsList} from '~/entities/governance/ui/proposals-list';
import {sendTransactions} from '~/entities/proposal/model/proposal';

export const Governance = () => {
  React.useEffect(() => {
    loadGovernanceProposals();
    sendTransactions();
  }, []);

  return (
    <>
      <Councils />
      <GovernanceProposalsFilters />
      <ProposalsList />
    </>
  );
};
