import {ProposalKindFilterType, TreasuryProposalStatus} from '~/entities/treasury';

export const ProposalStatuses: TreasuryProposalStatus[] = ['all', 'active', 'approved', 'failed'];
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
