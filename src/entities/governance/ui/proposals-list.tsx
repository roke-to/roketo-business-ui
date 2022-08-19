import {useStore} from 'effector-react';
import React from 'react';

import {ChangePolicyButton} from '~/entities/councils/ui/councils/change-policy-button';
import {$governanceProposals, $governanceSelectedProposalStatus} from '~/entities/governance/model';
import {Proposal} from '~/entities/proposal';
import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';

export const ProposalsList = () => {
  const governanceProposals = useStore($governanceProposals);
  const governanceSelectedProposalStatus = useStore($governanceSelectedProposalStatus);

  if (governanceProposals.length === 0) {
    const isDefaultFiltersValue = governanceSelectedProposalStatus === 'all';

    return (
      <EmptyProposalList
        isDefaultFiltersValue={isDefaultFiltersValue}
        createProposalComponent={<ChangePolicyButton />}
      />
    );
  }

  return (
    <>
      {governanceProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
