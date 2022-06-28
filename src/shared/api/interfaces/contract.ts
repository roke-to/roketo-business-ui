import {Contract} from 'near-api-js';

type ContractViewFunction<P, T> = (self: SputnikFactoryDAO, args: P) => Promise<T>;
type ContractChangeFunction<P, T> = (args: P) => Promise<T>;

type AccountId = string;

type Base58CryptoHash = string;

type DaoContractMetadata = {
  version: Version;
  commit_id: string;
  changelog_url?: string;
};

type Base64VecU8 = {};

type ContractMetadata = [Base58CryptoHash, DaoContractMetadata];

type Version = [number, number];

export type SputnikFactoryDAO = Contract & {
  get_dao_list: ContractViewFunction<never, AccountId[]>;
  get_number_daos: ContractViewFunction<never, number>;
  get_daos: ContractViewFunction<{from_index: number; limit: number}, AccountId[]>;
  get_owner: ContractViewFunction<never, AccountId>;
  get_default_code_hash: ContractViewFunction<never, Base58CryptoHash>;
  get_default_version: ContractViewFunction<never, Version>;
  /// Returns non serialized code by given code hash.
  get_code: ContractViewFunction<{code_hash: Base58CryptoHash}, string>;
  get_contracts_metadata: ContractViewFunction<never, ContractMetadata[]>;

  new: ContractChangeFunction<never, SputnikFactoryDAO>;
  create: ContractChangeFunction<{name: AccountId; args: Base64VecU8}, void>;
  set_owner: ContractChangeFunction<{owner_id: AccountId}, void>;
  set_default_code_hash: ContractChangeFunction<{code_hash: Base58CryptoHash}, void>;
  delete_contract: ContractChangeFunction<{code_hash: Base58CryptoHash}, void>;
  update: ContractChangeFunction<{account_id: AccountId; code_hash: Base58CryptoHash}, void>;
  store_contract_metadata: ContractChangeFunction<
    {
      code_hash: Base58CryptoHash;
      metadata: DaoContractMetadata;
      set_default: boolean;
    },
    void
  >;
  delete_contract_metadata: ContractChangeFunction<{code_hash: Base58CryptoHash}, void>;
  store: ContractChangeFunction<never, Base58CryptoHash>;
};
