import {ProposalStatus} from '~/shared/types/proposal-status';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

export const addStatusProposalQuery = (
  search: SFields | SConditionAND,
  status: ProposalStatus,
): void => {
  switch (status) {
    case 'active':
      search.$and?.push({
        status: {
          $eq: 'InProgress',
        },
      });
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
          $in: ['Rejected', 'Failed'],
        },
      });
      break;
    case 'all':
    default:
      break;
  }
};
