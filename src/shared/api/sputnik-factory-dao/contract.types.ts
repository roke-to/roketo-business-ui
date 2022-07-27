import {Contract} from 'near-api-js';

import {ContractChangeFunction, ContractViewFunction} from '../contract.types';

export type AccountId = string;

export type Base58CryptoHash = string;

export interface DaoContractMetadata {
  version: Version;
  commit_id: string;
  changelog_url?: string;
}

export interface SputnikBaseParams {
  code_hash: Base58CryptoHash;
}

export interface UpdateSputnikContractParams extends SputnikBaseParams {
  account_id: AccountId;
}

export interface MetaDataSputnikContractParams extends SputnikBaseParams {
  metadata: DaoContractMetadata;
  set_default: boolean;
}

export interface DaosParams {
  from_index: number;
  limit: number;
}

export interface CreateSputnikContractParams {
  name: AccountId;
  args?: Base64VecU8;
}

type Base64VecU8 = string;

type ContractMetadata = [Base58CryptoHash, DaoContractMetadata];

type Version = [number, number];

export type SputnikFactoryDao = Contract & {
  get_dao_list: ContractViewFunction<never, AccountId[]>;
  get_number_daos: ContractViewFunction<never, number>;
  get_daos: ContractViewFunction<DaosParams, AccountId[]>;
  get_owner: ContractViewFunction<never, AccountId>;
  get_default_code_hash: ContractViewFunction<never, Base58CryptoHash>;
  get_default_version: ContractViewFunction<never, Version>;
  /// Returns non serialized code by given code hash.
  get_code: ContractViewFunction<SputnikBaseParams, string>;
  get_contracts_metadata: ContractViewFunction<never, ContractMetadata[]>;

  new: ContractChangeFunction<never, SputnikFactoryDao>;
  create: ContractChangeFunction<CreateSputnikContractParams, void>;
  set_owner: ContractChangeFunction<{owner_id: AccountId}, void>;
  set_default_code_hash: ContractChangeFunction<SputnikBaseParams, void>;
  delete_contract: ContractChangeFunction<SputnikBaseParams, void>;
  update: ContractChangeFunction<UpdateSputnikContractParams, void>;
  store_contract_metadata: ContractChangeFunction<MetaDataSputnikContractParams, void>;
  delete_contract_metadata: ContractChangeFunction<SputnikBaseParams, void>;
  store: ContractChangeFunction<never, Base58CryptoHash>;
};
