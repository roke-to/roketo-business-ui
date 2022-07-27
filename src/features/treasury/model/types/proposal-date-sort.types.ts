import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';

export interface ProposalSort {
  label: string;
  value: string;
  sortType: ProposalSortOrderType;
}
