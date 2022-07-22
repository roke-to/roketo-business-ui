import {ProposalSortOrderType} from '~/entities/treasury';

export interface ProposalSort {
  label: string;
  value: string;
  sortType: ProposalSortOrderType;
}
