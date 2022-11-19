import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';

export const addStatusProposalQuery = (
  status: ProposalStatusFilterType,
): {
  status?: string;
  active?: boolean;
  failed?: boolean;
} => {
  switch (status) {
    case 'active':
      return {active: true, status: 'InProgress'};
    case 'approved':
      return {status: 'Approved'};
    case 'failed':
      return {failed: true};
    case 'rejected':
      return {status: 'Rejected'};
    case 'expired':
      return {status: 'Expired'};
    case 'all':
    default:
      return {};
  }
};
