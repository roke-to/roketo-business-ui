import {useStore} from 'effector-react';
import React from 'react';

import {
  $governanceProposals,
  $governanceSelectedProposalStatus,
  loadGovernanceProposals,
} from '~/entities/governance';
import {Proposal} from '~/widgets/proposal';
import {EmptyProposalList} from '~/widgets/proposal/ui/empty-proposal-list';

export const ProposalsList = () => {
  const governanceProposals = useStore($governanceProposals);
  const governanceSelectedProposalStatus = useStore($governanceSelectedProposalStatus);

  React.useEffect(() => {
    loadGovernanceProposals();
  }, []);

  if (governanceProposals.length === 0) {
    const isDefaultFiltersValue = governanceSelectedProposalStatus === 'all';

    return <EmptyProposalList isDefaultFiltersValue={isDefaultFiltersValue} />;
  }

  return (
    <>
      {governanceProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
