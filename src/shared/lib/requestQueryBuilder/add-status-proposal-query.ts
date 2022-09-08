import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

export const addStatusProposalQuery = (
  search: SFields | SConditionAND,
  status: ProposalStatusFilterType,
): void => {
  switch (status) {
    case 'active':
      search.$and?.push(
        {
          status: {
            $eq: 'InProgress',
          },
        },
        {
          voteStatus: {
            $eq: 'Active',
          },
        },
      );
      break;
    case 'approved':
      search.$and?.push({
        status: {
          $eq: 'Approved',
        },
      });
      break;
    case 'failed':
      search.$and?.push({
        status: {
          $eq: 'Failed',
        },
      });
      break;
    case 'rejected':
      search.$and?.push({
        status: {
          $eq: 'Rejected',
        },
      });
      break;
    case 'expired':
      search.$and?.push({
        voteStatus: {
          $eq: 'Expired',
        },
      });
      break;
    case 'all':
    default:
      break;
  }
};
