import React from 'react';

import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

import styles from './filter.module.css';
import {ProposalDateSort} from './proposal-date-sort';
import {ProposalKindFilter} from './proposal-kind-filter';
import {ProposalStatusFilter} from './proposal-status-filter';

export interface ProposalsFiltersProps {
  selectedProposalStatus: ProposalStatus;
  selectedProposalKind?: ProposalKindFilterType;
  proposalSortOrder: ProposalSortOrderType;
  isLoading: boolean;
  handleChangeProposalStatus(status: ProposalStatus): void;
  handleChangeProposalKind?(kind: ProposalKindFilterType): void;
  handleChangeProposalSortOrder(sortType: ProposalSortOrderType): void;
}

export const ProposalsFilters = ({
  selectedProposalStatus,
  selectedProposalKind,
  proposalSortOrder,
  isLoading,
  handleChangeProposalStatus,
  handleChangeProposalKind,
  handleChangeProposalSortOrder,
}: ProposalsFiltersProps) => {
  const hasKindModule = selectedProposalKind && typeof handleChangeProposalKind !== undefined;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <ProposalStatusFilter
          isLoading={isLoading}
          selectedProposalStatus={selectedProposalStatus}
          selectedProposalKind={selectedProposalKind}
          handleChangeProposalStatus={handleChangeProposalStatus}
          handleChangeProposalKind={handleChangeProposalKind}
        />
        {hasKindModule && (
          <ProposalKindFilter
            selectedProposalKind={selectedProposalKind}
            handleChangeProposalKind={handleChangeProposalKind}
          />
        )}
      </div>
      <ProposalDateSort
        proposalSortOrder={proposalSortOrder}
        handleChangeProposalSortOrder={handleChangeProposalSortOrder}
      />
    </div>
  );
};
