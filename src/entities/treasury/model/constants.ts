import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

export const ProposalStatuses: ProposalStatus[] = ['all', 'active', 'approved', 'failed'];
export const ProposalKind: ProposalKindFilterType[] = [
  'Any',
  'ChangeConfig',
  'ChangePolicy',
  'AddMemberToRole',
  'RemoveMemberFromRole',
  'FunctionCall',
  'UpgradeSelf',
  'UpgradeRemote',
  'Transfer',
  'SetStakingContract',
  'AddBounty',
  'BountyDone',
  'Vote',
];

export const ProposalKindForTreasury: ProposalKindFilterType[] = [
  'Any',
  'FunctionCall',
  'Transfer',
];

export const ProposalKindForGovernance: ProposalKindFilterType[] = [
  'Any',
  'ChangeConfig',
  'ChangePolicy',
  'AddMemberToRole',
  'RemoveMemberFromRole',
];
