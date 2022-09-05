import {Account, Contract} from 'near-api-js';

import {ContractChangeFunction} from '../contract.types';
import {CreateProposalKind} from './proposal.types';

export type ProposalInput = {
  // Description of this proposal.
  description: string;
  // Kind of proposal with relevant information.
  kind: CreateProposalKind;
};

export enum VoteAction {
  // Action to add proposal. Used internally.
  AddProposal = 'AddProposal',
  // Action to remove given proposal. Used for immediate deletion in special cases.
  RemoveProposal = 'RemoveProposal',
  // Vote to approve given proposal or bounty.
  VoteApprove = 'VoteApprove',
  // Vote to reject given proposal or bounty.
  VoteReject = 'VoteReject',
  // Vote to remove given proposal or bounty (because it's spam).
  VoteRemove = 'VoteRemove',
  // Finalize proposal, called when it's expired to return the funds
  // (or in the future can be used for early proposal closure).
  Finalize = 'Finalize',
  // Move a proposal to the hub to shift into another DAO.
  MoveToHub = 'MoveToHub',
}

export class SputnikDaoContract extends Contract {
  constructor(account: Account, contractId: string) {
    super(account, contractId, {
      viewMethods: [
        'delegation_balance_of',
        'delegation_balance_ratio',
        'delegation_total_supply',
        'get_available_amount',
        'get_bounties',
        'get_bounty',
        'get_bounty_claims',
        'get_bounty_number_of_claims',
        'get_config',
        'get_factory_info',
        'get_last_bounty_id',
        'get_last_proposal_id',
        'get_locked_storage_amount',
        'get_policy',
        'get_proposal',
        'get_proposals',
        'get_staking_contract',
        'has_blob',
        'version',
      ],
      changeMethods: [
        'act_proposal',
        'add_proposal',
        'bounty_claim',
        'bounty_done',
        'bounty_giveup',
        'delegate',
        'migrate',
        'new',
        'register_delegation',
        'remove_blob',
        'store_blob',
        'undelegate',
      ],
    });
  }

  // viewMethods
  delegation_balance_of!: any;

  delegation_balance_ratio!: any;

  delegation_total_supply!: any;

  get_available_amount!: any;

  get_bounties!: any;

  get_bounty!: any;

  get_bounty_claims!: any;

  get_bounty_number_of_claims!: any;

  get_config!: any;

  get_factory_info!: any;

  get_last_bounty_id!: any;

  get_last_proposal_id!: any;

  get_locked_storage_amount!: any;

  get_policy!: any;

  get_proposal!: any;

  get_proposals!: any;

  get_staking_contract!: any;

  has_blob!: any;

  version!: any;

  // changeMethods

  /**
   * Act on given proposal by id, if permissions allow.
   *
   * Memo is logged but not stored in the state.
   * Can be used to leave notes or explain the action.
   */
  act_proposal!: ContractChangeFunction<{id: number; action: VoteAction; memo?: string}>;

  /**
   * Add proposal to this DAO.
   */
  add_proposal!: ContractChangeFunction<{proposal: ProposalInput}>;

  bounty_claim!: any;

  bounty_done!: any;

  bounty_giveup!: any;

  delegate!: any;

  migrate!: any;

  new!: any;

  register_delegation!: any;

  remove_blob!: any;

  store_blob!: any;

  undelegate!: any;
}

export {mapChangeQuorumOptions} from './map-change-quorum-options';
export {mapAddCouncilOptions} from './map-add-council-options';
export {mapRemoveCouncilOptions} from './map-remove-council-options';
