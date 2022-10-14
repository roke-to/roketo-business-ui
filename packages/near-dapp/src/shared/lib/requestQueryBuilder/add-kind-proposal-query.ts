import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';

export const addKindProposalQuery = (
  kind: ProposalKindFilterType,
  defaultKindFilterQuery: string,
): string => {
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
      return kind;
    case 'Any':
    default:
      return defaultKindFilterQuery;
  }
};
