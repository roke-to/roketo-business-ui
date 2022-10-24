import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';
import {
  $treasuryProposals,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
} from '~/entities/treasury/model/treasury';
import {CreateTreasuryProposalButton} from '~/entities/treasury/ui/create-treasury-proposal-button';
import {Col} from 'ui/components/col';

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
        createProposalComponent={<CreateTreasuryProposalButton />}
      />
    );
  }

  return (
    <Col gap={3}>
      {treasuryProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </Col>
  );
};
