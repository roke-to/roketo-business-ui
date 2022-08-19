import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';
import {
  $treasuryProposals,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
} from '~/entities/treasury/model/treasury';

export const ProposalsList = () => {
  const treasuryProposal = useStore($treasuryProposals);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);

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
