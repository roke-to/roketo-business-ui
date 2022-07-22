import React from 'react';

import {ProposalDateSort} from '~/features/treasury/ui/filters/proposal-date-sort';
import {ProposalKindFilter} from '~/features/treasury/ui/filters/proposal-kind-filter';
import {ProposalStatusFilter} from '~/features/treasury/ui/filters/proposal-status-filter';

import styles from './filters/filter.module.css';

export const ProposalsFilters = () => (
  <div className={styles.filtersContainer}>
    <div className={styles.filterGroup}>
      <ProposalStatusFilter />
      <ProposalKindFilter />
    </div>
    <ProposalDateSort />
  </div>
);
