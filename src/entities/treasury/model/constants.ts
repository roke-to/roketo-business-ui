import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';
import {ProposalVariantFilterType} from '~/shared/types/proposal-variant-filter-type';

export const ProposalStatuses: ProposalStatusFilterType[] = [
  'all',
  'active',
  'approved',
  'failed',
  'rejected',
  'expired',
];
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
  'ChangePolicy',
  'AddMemberToRole',
  'RemoveMemberFromRole',
];

export const ProposalVariantForStream: ProposalVariantFilterType[] = [
  'ProposeCreateRoketoStream',
  'ProposePauseRoketoStream',
  'ProposeStartRoketoStream',
  'ProposeStopRoketoStream',
  'ProposeRoketoStreamWithdraw',
];
