import {Contract} from 'near-api-js';

import {ContractChangeFunction} from '../contract.types';
import {CreateProposalKind} from './proposal';

export type ProposalInput = {
  // Description of this proposal.
  description: string;
  // Kind of proposal with relevant information.
  kind: CreateProposalKind;
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
