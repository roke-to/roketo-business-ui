import {useStore} from 'effector-react';
import React from 'react';

import {$treasuryProposals, loadTreasuryProposals} from '~/entities/treasury';
import {EmptyProposalList} from '~/features/treasury/ui/empty-proposal-list';
import {Proposal} from '~/widgets/proposal';

export const ProposalsList = () => {
  const treasuryProposal = useStore($treasuryProposals);

  React.useEffect(() => {
    loadTreasuryProposals();
  }, []);

  if (treasuryProposal.length === 0) {
    return <EmptyProposalList />;
  }

  return (
    <>
      {treasuryProposal.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
