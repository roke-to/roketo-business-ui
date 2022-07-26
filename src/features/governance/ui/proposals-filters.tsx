import {useStore} from 'effector-react';
import React from 'react';

import {
  $governanceProposalLoading,
  $governanceProposalSortOrder,
  $governanceSelectedProposalStatus,
  changeGovernanceProposalSelectedStatus,
  changeGovernanceProposalSortOrder,
} from '~/entities/governance';
import styles from '~/widgets/filters/filter.module.css';
import {ProposalDateSort} from '~/widgets/filters/proposal-date-sort';
import {ProposalStatusFilter} from '~/widgets/filters/proposal-status-filter';

export const GovernanceProposalsFilters = () => {
  const governanceSelectedProposalStatus = useStore($governanceSelectedProposalStatus);
  const isLoading = useStore($governanceProposalLoading);
  const governanceProposalSortOrder = useStore($governanceProposalSortOrder);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <ProposalStatusFilter
          isLoading={isLoading}
          selectedProposalStatus={governanceSelectedProposalStatus}
          handleChangeProposalStatus={changeGovernanceProposalSelectedStatus}
        />
      </div>
      <ProposalDateSort
        proposalSortOrder={governanceProposalSortOrder}
        handleChangeProposalSortOrder={changeGovernanceProposalSortOrder}
      />
    </div>
  );
};
