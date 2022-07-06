import {Account, Contract} from 'near-api-js';

import {
  AccountId,
  Base58CryptoHash,
  CreateSputnikContractParams,
  DaosParams,
  MetaDataSputnikContractParams,
  SputnikBaseParams,
  SputnikFactoryDAO,
} from '~/shared/api/sputnik-factory-dao/types';
import {env} from '~/shared/config/env';

import {templateCreateArgs} from './template-create-args';

export class SputnikFactoryDaoApi {
  contract: SputnikFactoryDAO;

  account: Account;

  constructor(account: Account) {
    this.account = account;
    this.contract = new Contract(account, env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME, {
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
  }

  async getDaoList() {
    return this.contract.get_dao_list();
  }

  async getNumberDaos() {
    return this.contract.get_number_daos();
  }

  async getDaos(params: DaosParams) {
    return this.contract.get_daos(params);
  }

  async getOwner() {
    return this.contract.get_owner();
  }

  async getDefaultCodeHash() {
    return this.contract.get_default_code_hash();
  }

  async getDefaultVersion() {
    return this.contract.get_default_version();
  }

  async getCode(params: SputnikBaseParams) {
    return this.contract.get_code(params);
  }

  async getContractsMetadata() {
    return this.contract.get_contracts_metadata();
  }

  async newContract() {
    return this.contract.new();
  }

  async create({name}: CreateSputnikContractParams, ...args: any[]) {
    return this.contract.create(
      {
        name,
        args: templateCreateArgs({name, accountId: this.account.accountId}),
      },
      ...args,
    );
  }

  async setOwner(ownerId: AccountId) {
    return this.contract.set_owner({owner_id: ownerId});
  }

  async setDefaultCodeHash(codeHash: Base58CryptoHash) {
    return this.contract.set_default_code_hash({code_hash: codeHash});
  }

  async deleteContract(params: SputnikBaseParams) {
    return this.contract.set_default_code_hash(params);
  }

  async update(codeHash: Base58CryptoHash) {
    return this.contract.update({account_id: this.account.accountId, code_hash: codeHash});
  }

  async storeContractMetadata(params: Omit<MetaDataSputnikContractParams, 'set_default'>) {
    return this.contract.store_contract_metadata({...params, set_default: false});
  }

  async deleteContractMetadata(codeHash: Base58CryptoHash) {
    return this.contract.delete_contract_metadata({code_hash: codeHash});
  }

  async store() {
    return this.contract.store();
  }
}
