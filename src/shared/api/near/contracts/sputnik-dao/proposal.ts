import Decimal from 'decimal.js';

export type ProposalAction =
  | 'Finalize'
  | 'AddProposal'
  | 'VoteApprove'
  | 'VoteReject'
  | 'VoteRemove';

export interface DefaultVotePolicy {
  weightKind: string;
  kind: string;
  ratio: number[];
  quorum: string;
  weight?: string;
}

export type DaoPermission =
  | '*:*'
  | '*:Finalize'
  | '*:AddProposal'
  | '*:VoteApprove'
  | '*:VoteReject'
  | '*:VoteRemove'
  | 'config:AddProposal'
  | 'policy:AddProposal'
  | 'add_bounty:AddProposal'
  | 'bounty_done:AddProposal'
  | 'transfer:AddProposal'
  | 'call:AddProposal'
  | 'vote:AddProposal'
  | 'remove_member_from_role:AddProposal'
  | 'add_member_to_role:AddProposal'
  | 'upgrade_self:AddProposal'
  | 'upgrade_remote:AddProposal'
  | 'set_vote_token:AddProposal'
  | 'config:VoteApprove'
  | 'call:VoteApprove'
  | 'upgrade_self:VoteApprove'
  | 'upgrade_remote:VoteApprove'
  | 'set_vote_token:VoteApprove'
  | 'bounty_done:VoteApprove'
  | 'policy:VoteApprove'
  | 'add_bounty:VoteApprove'
  | 'transfer:VoteApprove'
  | 'vote:VoteApprove'
  | 'remove_member_from_role:VoteApprove'
  | 'add_member_to_role:VoteApprove'
  | 'config:VoteReject'
  | 'call:VoteReject'
  | 'upgrade_self:VoteReject'
  | 'upgrade_remote:VoteReject'
  | 'set_vote_token:VoteReject'
  | 'bounty_done:VoteReject'
  | 'policy:VoteReject'
  | 'add_bounty:VoteReject'
  | 'transfer:VoteReject'
  | 'vote:VoteReject'
  | 'remove_member_from_role:VoteReject'
  | 'add_member_to_role:VoteReject'
  | 'config:VoteRemove'
  | 'call:VoteRemove'
  | 'upgrade_self:VoteRemove'
  | 'upgrade_remote:VoteRemove'
  | 'set_vote_token:VoteRemove'
  | 'bounty_done:VoteRemove'
  | 'policy:VoteRemove'
  | 'add_bounty:VoteRemove'
  | 'transfer:VoteRemove'
  | 'vote:VoteRemove'
  | 'remove_member_from_role:VoteRemove'
  | 'add_member_to_role:VoteRemove';

export type DaoRoleKind = 'Everyone' | 'Group' | 'Member';

export type DaoRole = {
  createdAt: string;
  id: string;
  name: string;
  kind: DaoRoleKind;
  balance: null;
  accountIds: string[] | null;
  permissions: DaoPermission[];
  votePolicy: Record<string, DefaultVotePolicy>;
};

export type PolicyType = Record<string, unknown> & {
  roles: DaoRole[];
  bountyBond: string;
  proposalBond: string;
  proposalPeriod: string;
  defaultVotePolicy: DefaultVotePolicy;
  bountyForgivenessPeriod: string;
};

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
  threshold?: number[];
  weight?: string;
};

export type TGroup = {
  members: string[];
  name: string;
  permissions: string[];
  votePolicy: Record<string, DaoVotePolicy>;
  slug: string;
};

export type DaoVersion = {
  createdAt: string;
  hash: string;
  version: number[];
  commitId: string;
  changelogUrl: string;
};

type DaoProperties = {
  id: string;
  name: string;
  description: string;
  flagCover?: string;
  flagLogo?: string;
  links: string[];
  displayName: string;
  legal?: {
    legalStatus?: string;
    legalLink?: string;
  };
};

export type DAO = {
  txHash: string;
  members: number;
  daoVersionHash: string;
  daoVersion: DaoVersion;
  daoMembersList: string[];
  funds: string;
  totalProposals: number;
  activeProposalsCount: number;
  totalProposalsCount: number;
  totalDaoFunds: number;
  createdAt: string;
  groups: TGroup[];
  policy: PolicyType;
  votes?: number;
  logo?: string;
  lastProposalId: number;
  stakingContract?: string;
} & DaoProperties;

export type CreateTransferInput = {
  token: string;
  amount: number;
  details: string;
  externalUrl: string;
  target: string;
  gas: number;
};

export type Token = {
  id: string;
  tokenId: string;
  decimals: number;
  symbol: string;
  icon: string;
  totalSupply?: string;
  balance: string;
  price: string | null;
};

export type Tokens = Record<string, Token>;

enum ProposalVariant {
  ProposeTransfer = 'ProposeTransfer',
  ProposeCreateBounty = 'ProposeCreateBounty',
  ProposeDoneBounty = 'ProposeDoneBounty',
  ProposeChangeDaoName = 'ProposeChangeDaoName',
  ProposeChangeDaoPurpose = 'ProposeChangeDaoPurpose',
  ProposeChangeDaoLinks = 'ProposeChangeDaoLinks',
  ProposeChangeDaoFlag = 'ProposeChangeDaoFlag',
  ProposeChangeDaoLegalInfo = 'ProposeChangeDaoLegalInfo',
  ProposeChangeDaoGetLastCode = 'ProposeChangeDaoGetLastCode',
  ProposeChangeDaoUpgradeSelf = 'ProposeChangeDaoUpgradeSelf',
  ProposeChangeDaoRemoveCodeBlob = 'ProposeChangeDaoRemoveCodeBlob',
  ProposeChangeVotingPolicy = 'ProposeChangeVotingPolicy',
  ProposeChangeBonds = 'ProposeChangeBonds',
  ProposeCreateGroup = 'ProposeCreateGroup',
  ProposeAddMember = 'ProposeAddMember',
  ProposeRemoveMember = 'ProposeRemoveMember',
  ProposePoll = 'ProposePoll',
  ProposeDefault = 'ProposeDefault',
  ProposeCustomFunctionCall = 'ProposeCustomFunctionCall',
  ProposeCreateToken = 'ProposeCreateToken',
  ProposeTokenDistribution = 'ProposeTokenDistribution',
  ProposeStakingContractDeployment = 'ProposeStakingContractDeployment',
  ProposeChangeProposalCreationPermissions = 'ProposeChangeProposalCreationPermissions',
  ProposeChangeProposalVotingPermissions = 'ProposeChangeProposalVotingPermissions',
  ProposeGetUpgradeCode = 'ProposeGetUpgradeCode',
  ProposeUpgradeSelf = 'ProposeUpgradeSelf',
  ProposeRemoveUpgradeCode = 'ProposeRemoveUpgradeCode',
  ProposeUpdateGroup = 'ProposeUpdateGroup',
  ProposeCreateDao = 'ProposeCreateDao',
  ProposeTransferFunds = 'ProposeTransferFunds',
  ProposeAcceptStakingContract = 'ProposeAcceptStakingContract',
  ProposeUpdateVotePolicyToWeightVoting = 'ProposeUpdateVotePolicyToWeightVoting',
  VoteInAnotherDao = 'VoteInAnotherDao',
  ProposeStakeTokens = 'ProposeStakeTokens',
  ProposeDelegateVoting = 'ProposeDelegateVoting',
}

export type AddBountyRequest = {
  description: string;
  token: string;
  amount: string;
  times: number;
  max_deadline: string;
};

interface AddBounty {
  bounty: AddBountyRequest;
}

interface UpgradeRemote {
  // valid account id
  receiver_id: string;
  method_name: string;
  hash: string;
}

interface UpgradeSelf {
  hash: string;
}

interface ChangePolicy {
  policy: unknown;
}

interface AddRemoveMemberRole {
  // valid account id
  member_id: string;
  role: string;
}

export type FunctionCallAction = {
  method_name: string;
  args: string;
  deposit: string;
  gas: string;
};

interface FunctionCall {
  receiver_id: string;
  actions: FunctionCallAction[];
}

export interface Transfer {
  token_id: string;
  // valid account id
  receiver_id: string;
  amount: string;
}

interface BountyDone {
  bounty_id: number;
  // valid account id
  receiver_id: string;
}

interface ChangeConfig {
  config: DaoConfig;
}

export interface DaoConfig {
  name: string;
  purpose: string;
  metadata: string | undefined;
}

enum Vote {
  Approve = 0x0,
  Reject = 0x1,
  Remove = 0x2,
}

export type CreateProposalKind = Partial<{
  ChangeConfig: ChangeConfig;
  ChangePolicy: ChangePolicy;
  AddMemberToRole: AddRemoveMemberRole;
  RemoveMemberFromRole: AddRemoveMemberRole;
  UpgradeSelf: UpgradeSelf;
  UpgradeRemote: UpgradeRemote;
  Transfer: Transfer;
  AddBounty: AddBounty;
  BountyDone: BountyDone;
  Vote: Vote;
  FunctionCall: FunctionCall;
}>;

export interface CreateProposalParams {
  daoId: string;
  description: string;
  kind:
    | 'ChangeConfig'
    | 'ChangePolicy'
    | 'AddMemberToRole'
    | 'RemoveMemberFromRole'
    | 'UpgradeSelf'
    | 'UpgradeRemote'
    | 'Transfer'
    | 'AddBounty'
    | 'BountyDone'
    | 'Vote'
    | 'FunctionCall';
  data?:
    | ChangeConfig
    | ChangePolicy
    | AddRemoveMemberRole
    | UpgradeSelf
    | UpgradeRemote
    | Transfer
    | AddBounty
    | BountyDone
    | Vote
    | FunctionCall;
  bond: string;
  gas?: number;
  variant?: ProposalVariant;
}

export interface VotePolicyRequest {
  weight_kind: string;
  quorum: string;
  threshold: number[] | string;
}

export interface ContractRole {
  name: string;
  kind: 'Everyone' | {Group: string[] | null} | {Member: string};
  permissions: string[];
  vote_policy: Record<string, VotePolicyRequest> | {};
}

const DATA_SEPARATOR = '$$$$';

// https://github.com/near-daos/astro-ui/blob/0bb743e91e2b2d32eb73eeb6d442313ddc5e836e/astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers.ts
// ts-unused-exports:disable-next-line
export async function getTransferProposal(
  dao: DAO,
  data: CreateTransferInput,
  tokens: Tokens,
): Promise<CreateProposalParams> {
  const {token: dToken, details, externalUrl, target, amount} = data;

  const token = Object.values(tokens).find((item) => item.symbol === dToken);

  if (!token) {
    throw new Error('No tokens data found');
  }

  return {
    daoId: dao.id,
    description: `${details}${DATA_SEPARATOR}${externalUrl}`,
    kind: 'Transfer',
    bond: dao.policy.proposalBond,
    data: {
      token_id: token?.tokenId,
      receiver_id: target.trim(),
      amount: new Decimal(amount).mul(new Decimal(10).pow(token.decimals)).toString(),
    },
  };
}
