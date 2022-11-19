import {useStore} from 'effector-react';
import React from 'react';

import {ProposalKind} from '~/entities/treasury/model/constants';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';
import {ProposalVariantFilterType} from '~/shared/types/proposal-variant-filter-type';

import {$isMobileScreen} from '@roketo/core/effects/screens';

import styles from './filter.module.css';
import {ProposalDateSort} from './proposal-date-sort';
import {ProposalKindFilter} from './proposal-kind-filter';
import {ProposalStatusFilter} from './proposal-status-filter';
import {ProposalVariantFilter} from './proposal-variant-filter';

export interface ProposalsFiltersProps {
  selectedProposalStatus: ProposalStatusFilterType;
  selectedProposalKind?: ProposalKindFilterType;
  selectedProposalVariant?: ProposalVariantFilterType;
  proposalSortOrder: ProposalSortOrderType;
  isLoading: boolean;
  kindOpions?: ProposalKindFilterType[];
  variantOptions?: ProposalVariantFilterType[];
  handleChangeProposalStatus(status: ProposalStatusFilterType): void;
  handleChangeProposalKind?(kind: ProposalKindFilterType): void;
  handleChangeProposalVariant?(kind: ProposalVariantFilterType): void;
  handleChangeProposalSortOrder(sortType: ProposalSortOrderType): void;
}

export const ProposalsFilters = ({
  selectedProposalStatus,
  selectedProposalKind,
  selectedProposalVariant,
  proposalSortOrder,
  isLoading,
  kindOpions = ProposalKind,
  variantOptions = [],
  handleChangeProposalStatus,
  handleChangeProposalKind,
  handleChangeProposalVariant,
  handleChangeProposalSortOrder,
}: ProposalsFiltersProps) => {
  const canShowModal = useStore($isMobileScreen);
  const hasKindModule = selectedProposalKind && handleChangeProposalKind && !canShowModal;
  const hasVariantModule =
    !!variantOptions.length &&
    selectedProposalVariant &&
    handleChangeProposalVariant &&
    !canShowModal;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <ProposalStatusFilter
          kindOptions={kindOpions}
          isLoading={isLoading}
          selectedProposalStatus={selectedProposalStatus}
          selectedProposalKind={selectedProposalKind}
          onChangeStatus={handleChangeProposalStatus}
          onChangeKind={handleChangeProposalKind}
        />
        {hasKindModule && (
          <ProposalKindFilter
            options={kindOpions}
            selectedProposalKind={selectedProposalKind}
            onChange={handleChangeProposalKind}
          />
        )}
        {hasVariantModule && (
          <ProposalVariantFilter
            options={variantOptions}
            selectedProposalKind={selectedProposalVariant}
            onChange={handleChangeProposalVariant}
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
