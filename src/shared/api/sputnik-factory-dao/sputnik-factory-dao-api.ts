import {Account} from 'near-api-js';

import {
  AccountId,
  Base58CryptoHash,
  CreateSputnikContractParams,
  DaosParams,
  MetaDataSputnikContractParams,
  SputnikBaseParams,
  SputnikFactoryDAO,
} from '~/shared/api/sputnik-factory-dao/types';

export class SputnikFactoryDaoApi {
  contract: SputnikFactoryDAO;

  account: Account;

  constructor({contract, account}: {contract: SputnikFactoryDAO; account: Account}) {
    this.contract = contract;

    this.account = account;
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

  async create(params: CreateSputnikContractParams) {
    return this.contract.create(params);
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
