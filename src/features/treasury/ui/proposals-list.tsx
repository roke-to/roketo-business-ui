import {useStore} from 'effector-react';
import React from 'react';

import {
  $treasuryProposals,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
  loadTreasuryProposals,
} from '~/entities/treasury';
import {Proposal} from '~/widgets/proposal';
import {EmptyProposalList} from '~/widgets/proposal/ui/empty-proposal-list';

export const ProposalsList = () => {
  const treasuryProposal = useStore($treasuryProposals);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);

  React.useEffect(() => {
    loadTreasuryProposals();
  }, []);

  if (treasuryProposal.length === 0) {
    const isDefaultFiltersValue =
      treasurySelectedProposalKind === 'Transfer' && treasurySelectedProposalStatus === 'all';

    return <EmptyProposalList isDefaultFiltersValue={isDefaultFiltersValue} />;
  }

  return (
    <>
      {treasuryProposal.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
