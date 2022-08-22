import {useStore} from 'effector-react';
import React from 'react';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {
  $governanceProposalLoading,
  $governanceProposalSortOrder,
  $governanceSelectedProposalKind,
  $governanceSelectedProposalStatus,
  changeGovernanceProposalSelectedKind,
  changeGovernanceProposalSelectedStatus,
  changeGovernanceProposalSortOrder,
} from '~/entities/governance/model';
import {ProposalKindForGovernance} from '~/entities/treasury/model/constants';

export const GovernanceProposalsFilters = () => {
  const governanceSelectedProposalStatus = useStore($governanceSelectedProposalStatus);
  const governanceSelectedProposalKind = useStore($governanceSelectedProposalKind);
  const isLoading = useStore($governanceProposalLoading);
  const governanceProposalSortOrder = useStore($governanceProposalSortOrder);

  return (
    <ProposalsFilters
      setKindProposal={ProposalKindForGovernance}
      isLoading={isLoading}
      selectedProposalStatus={governanceSelectedProposalStatus}
      selectedProposalKind={governanceSelectedProposalKind}
      proposalSortOrder={governanceProposalSortOrder}
      handleChangeProposalStatus={changeGovernanceProposalSelectedStatus}
      handleChangeProposalSortOrder={changeGovernanceProposalSortOrder}
      handleChangeProposalKind={changeGovernanceProposalSelectedKind}
    />
  );
};
