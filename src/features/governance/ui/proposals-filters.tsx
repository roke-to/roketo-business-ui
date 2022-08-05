import {useStore} from 'effector-react';
import React from 'react';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {
  $governanceProposalLoading,
  $governanceProposalSortOrder,
  $governanceSelectedProposalStatus,
  changeGovernanceProposalSelectedStatus,
  changeGovernanceProposalSortOrder,
} from '~/entities/governance';

export const GovernanceProposalsFilters = () => {
  const governanceSelectedProposalStatus = useStore($governanceSelectedProposalStatus);
  const isLoading = useStore($governanceProposalLoading);
  const governanceProposalSortOrder = useStore($governanceProposalSortOrder);

  return (
    <ProposalsFilters
      isLoading={isLoading}
      selectedProposalStatus={governanceSelectedProposalStatus}
      proposalSortOrder={governanceProposalSortOrder}
      handleChangeProposalStatus={changeGovernanceProposalSelectedStatus}
      handleChangeProposalSortOrder={changeGovernanceProposalSortOrder}
    />
  );
};
