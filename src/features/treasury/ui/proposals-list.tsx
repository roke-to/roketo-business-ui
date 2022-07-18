import {useStore} from 'effector-react';
import React from 'react';

import {$treasuryProposals, loadTreasuryProposals} from '~/entities/treasury';
import {Proposal} from '~/widgets/proposal';

export const ProposalsList = () => {
  const treasuryProposals = useStore($treasuryProposals).filter(
    (proposal) => proposal.kind.type === 'Transfer',
  );

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
