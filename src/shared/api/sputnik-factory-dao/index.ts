import * as nearAPI from 'near-api-js';
import {Account} from 'near-api-js';

import {SputnikFactoryDaoApi} from '~/shared/api/sputnik-factory-dao/sputnik-factory-dao-api';
import {SputnikFactoryDAO} from '~/shared/api/sputnik-factory-dao/types';
import {env} from '~/shared/config/env';

export async function initSputnikFactoryDao({
  account,
}: {
  account: Account;
}): Promise<{api: SputnikFactoryDaoApi}> {
  const contract = new nearAPI.Contract(account, env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME, {
    viewMethods: [
      'get_dao_list',
      'get_number_daos',
      'get_daos',
      'get_owner',
      'get_default_code_hash',
      'get_default_version',
      'get_code',
      'get_contracts_metadata',
    ],
    changeMethods: [
      'new',
      'create',
      'set_owner',
      'set_default_code_hash',
      'delete_contract',
      'update',
      'store_contract_metadata',
      'delete_contract_metadata',
      'store',
    ],
  }) as SputnikFactoryDAO;

  const api = new SputnikFactoryDaoApi({contract, account});

  return {
    api,
  };
}
