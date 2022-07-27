import {useStore} from 'effector-react';
import React from 'react';

import {
  $governanceProposalLoading,
  $governanceProposalSortOrder,
  $governanceSelectedProposalStatus,
  changeGovernanceProposalSelectedStatus,
  changeGovernanceProposalSortOrder,
} from '~/entities/governance';
import {ProposalsFilters} from '~/widgets/filters/proposals-filters';

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
