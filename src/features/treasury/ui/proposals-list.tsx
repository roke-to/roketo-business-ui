import {useStore} from 'effector-react';
import React from 'react';

import {$treasuryProposals, loadTreasuryProposals} from '~/entities/treasury';
import {Proposal} from '~/widgets/proposal';

export const ProposalsList = () => {
  const treasuryProposal = useStore($treasuryProposals);

  React.useEffect(() => {
    loadTreasuryProposals();
  }, []);

  return (
    <>
      {treasuryProposal.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
