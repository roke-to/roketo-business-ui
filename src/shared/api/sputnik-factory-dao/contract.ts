import {Account, Contract} from 'near-api-js';

import {env} from '~/shared/config/env';

import {ChangeMethodOptions} from '../contract.types';
import {
  AccountId,
  Base58CryptoHash,
  CreateSputnikContractParams,
  DaosParams,
  MetaDataSputnikContractParams,
  SputnikBaseParams,
  SputnikFactoryDao,
} from './contract.types';

export class SputnikFactoryDaoContract {
  contract: SputnikFactoryDao;

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
    }) as SputnikFactoryDao;
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
    // TODO: как прокидывать вывзов без аргументов, в near-api-js они вроде обязательны
    // @ts-expect-error
    return this.contract.new();
  }

  async create(options: ChangeMethodOptions<CreateSputnikContractParams>) {
    return this.contract.create(options);
  }

  async setOwner(options: ChangeMethodOptions<{owner_id: AccountId}>) {
    return this.contract.set_owner(options);
  }

  async setDefaultCodeHash(options: ChangeMethodOptions<{code_hash: Base58CryptoHash}>) {
    return this.contract.set_default_code_hash(options);
  }

  async deleteContract(options: ChangeMethodOptions<SputnikBaseParams>) {
    return this.contract.set_default_code_hash(options);
  }

  async update(options: ChangeMethodOptions<{account_id: string; code_hash: string}>) {
    return this.contract.update(options);
  }

  async storeContractMetadata(
    options: ChangeMethodOptions<Omit<MetaDataSputnikContractParams, 'set_default'>>,
  ) {
    return this.contract.store_contract_metadata({
      ...options,
      args: {...options.args, set_default: false},
    });
  }

  async deleteContractMetadata(options: ChangeMethodOptions<{code_hash: Base58CryptoHash}>) {
    return this.contract.delete_contract_metadata(options);
  }

  async store() {
    // @ts-expect-error
    return this.contract.store();
  }
}
