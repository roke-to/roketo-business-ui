import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';
import {
  $treasuryProposals,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
} from '~/entities/treasury/model/treasury';
import {CreateProposalTransferButton} from '~/entities/treasury/ui/create-proposal-transfer-button';

export const ProposalsList = () => {
  const treasuryProposals = useStore($treasuryProposals);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);

  if (treasuryProposals.length === 0) {
    const isDefaultFiltersValue =
      treasurySelectedProposalKind === 'Any' && treasurySelectedProposalStatus === 'all';

    return (
      <EmptyProposalList
        isDefaultFiltersValue={isDefaultFiltersValue}
        createProposalComponent={<CreateProposalTransferButton />}
      />
    );
  }

  return (
    <>
      {treasuryProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
