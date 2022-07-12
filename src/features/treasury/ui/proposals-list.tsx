import {useStore} from 'effector-react';
import React from 'react';

import {$treasuryProposals, loadTreasuryProposals} from '~/entities/treasury';
import {Proposal} from '~/shared/ui/components/proposal';

export const ProposalsList = () => {
  const treasuryProposals = useStore($treasuryProposals);

  React.useEffect(() => {
    loadTreasuryProposals();
  }, []);

  return (
    <>
      {treasuryProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
