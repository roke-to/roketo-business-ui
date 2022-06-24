import {Account, Contract} from 'near-api-js';

// import {env} from '~/shared/config/env';

export async function initSputnikDao({account}: {account: Account}): Promise<Contract> {
  // TODO: pass as arg
  const daoId = 'extg2.sputnikv2.testnet';
  const contract = new Contract(account, daoId, {
    viewMethods: [
      'version',
      'get_config',
      'get_policy',
      'get_staking_contract',
      'has_blob',
      'get_locked_storage_amount',
      'get_available_amount',
      'delegation_total_supply',
      'delegation_balance_of',
      'delegation_balance_ratio',
      'get_last_proposal_id',
      'get_proposals',
      'get_proposal',
      'get_bounty',
      'get_last_bounty_id',
      'get_bounties',
      'get_bounty_claims',
      'get_bounty_number_of_claims',
      'get_factory_info',
    ],
    changeMethods: [
      'new',
      'migrate',
      'store_blob',
      'remove_blob',
      'add_proposal',
      'act_proposal',
      'bounty_claim',
      'bounty_done',
      'bounty_giveup',
      'register_delegation',
      'delegate',
      'undelegate',
    ],
  });

  return contract;
}
