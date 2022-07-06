import {Contract} from 'near-api-js';

import {Action} from '~/shared/api/sputnik-dao/consts';

type ProposalInput = {
  // Description of this proposal.
  description: string;
  // Kind of proposal with relevant information.
  kind: any;
};

// Sputnik DAO :: v3 see https://github.com/near-daos/sputnik-dao-contract/blob/main/sputnikdao2/ABI.md#sputnik-dao--v3
export type SputnikDAO = Contract & {
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
  add_proposal: (proposal: ProposalInput) => number;
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
