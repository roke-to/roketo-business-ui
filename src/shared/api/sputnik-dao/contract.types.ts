import {Contract} from 'near-api-js';

import {ContractChangeFunction} from '../contract.types';

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

type ProposalKind = Partial<{
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

export type ProposalInput = {
  // Description of this proposal.
  description: string;
  // Kind of proposal with relevant information.
  kind: ProposalKind;
};

enum Action {
  // Action to add proposal. Used internally.
  AddProposal,
  // Action to remove given proposal. Used for immediate deletion in special cases.
  RemoveProposal,
  // Vote to approve given proposal or bounty.
  VoteApprove,
  // Vote to reject given proposal or bounty.
  VoteReject,
  // Vote to remove given proposal or bounty (because it's spam).
  VoteRemove,
  // Finalize proposal, called when it's expired to return the funds
  // (or in the future can be used for early proposal closure).
  Finalize,
  // Move a proposal to the hub to shift into another DAO.
  MoveToHub,
}

// Sputnik DAO :: v3 see https://github.com/near-daos/sputnik-dao-contract/blob/main/sputnikdao2/ABI.md#sputnik-dao--v3
export type SputnikDao = Contract & {
  // viewMethods
  delegation_balance_of: any;
  delegation_balance_ratio: any;
  delegation_total_supply: any;
  get_available_amount: any;
  get_bounties: any;
  get_bounty: any;
  get_bounty_claims: any;
  get_bounty_number_of_claims: any;
  get_config: any;
  get_factory_info: any;
  get_last_bounty_id: any;
  get_last_proposal_id: any;
  get_locked_storage_amount: any;
  get_policy: any;
  get_proposal: any;
  get_proposals: any;
  get_staking_contract: any;
  has_blob: any;
  version: any;

  // changeMethods

  /**
   * Act on given proposal by id, if permissions allow.
   *
   * Memo is logged but not stored in the state.
   * Can be used to leave notes or explain the action.
   */
  act_proposal: (id: number, action: Action, memo?: string) => void;

  /**
   * Add proposal to this DAO.
   */
  add_proposal: ContractChangeFunction<{proposal: ProposalInput}>;
  bounty_claim: any;
  bounty_done: any;
  bounty_giveup: any;
  delegate: any;
  migrate: any;
  new: any;
  register_delegation: any;
  remove_blob: any;
  store_blob: any;
  undelegate: any;
};
