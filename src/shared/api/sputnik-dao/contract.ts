import {Account, Contract} from 'near-api-js';

import {ChangeMethodOptions} from '../contract.types';
import {ProposalInput, SputnikDao} from './contract.types';

export class SputnikDaoContract {
  contract: SputnikDao;

  account: Account;

  constructor(account: Account, daoId: string) {
    this.account = account;
    this.contract = new Contract(account, daoId, {
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
    }) as SputnikDao;
  }

  async addProposal(options: ChangeMethodOptions<{proposal: ProposalInput}>) {
    return this.contract.add_proposal(options);
  }
}
