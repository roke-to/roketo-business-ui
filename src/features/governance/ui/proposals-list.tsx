import {useStore} from 'effector-react';
import React from 'react';

import {$governanceProposals, loadGovernanceProposals} from '~/entities/governance';
import {Proposal} from '~/shared/ui/components/proposal';

export const ProposalsList = () => {
  const governanceProposals = useStore($governanceProposals);

  React.useEffect(() => {
    loadGovernanceProposals();
  }, []);

  return (
    <>
      {governanceProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
