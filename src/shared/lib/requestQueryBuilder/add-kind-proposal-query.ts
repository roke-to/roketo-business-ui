import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

export const addKindProposalQuery = (
  search: SFields | SConditionAND,
  kind: ProposalKindFilterType,
  defaultKindFilterQuery: SFields | SConditionAND,
): void => {
  switch (kind) {
    case 'Transfer':
    case 'ChangeConfig':
    case 'ChangePolicy':
    case 'AddMemberToRole':
    case 'RemoveMemberFromRole':
    case 'FunctionCall':
    case 'UpgradeSelf':
    case 'SetStakingContract':
    case 'AddBounty':
    case 'BountyDone':
    case 'Vote':
      search.$and?.push({
        kind: {
          $cont: kind,
        },
      });
      break;
    case 'Any':
    default:
      search.$and?.push(defaultKindFilterQuery);
      break;
  }
};
