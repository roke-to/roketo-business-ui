import {useStore} from 'effector-react';
import React from 'react';

import {ChangePolicyButton} from '~/entities/councils/ui/councils/change-policy-button';
import {
  $governanceProposals,
  $governanceSelectedProposalKind,
  $governanceSelectedProposalStatus,
} from '~/entities/governance/model';
import {Proposal} from '~/entities/proposal';
import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';
import {Col} from '~/shared/ui/components/col';

export const ProposalsList = () => {
  const governanceProposals = useStore($governanceProposals);
  const governanceSelectedProposalStatus = useStore($governanceSelectedProposalStatus);
  const governanceSelectedProposalKind = useStore($governanceSelectedProposalKind);

  if (governanceProposals.length === 0) {
    const isDefaultFiltersValue =
      governanceSelectedProposalKind === 'Any' && governanceSelectedProposalStatus === 'all';

    return (
      <EmptyProposalList
        isDefaultFiltersValue={isDefaultFiltersValue}
        createProposalComponent={<ChangePolicyButton />}
      />
    );
  }

  return (
    <Col gap={3}>
      {governanceProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </Col>
  );
};
