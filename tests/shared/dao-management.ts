import BN from 'bn.js';
import decamelize from 'decamelize';
import {Account, connect, keyStores, Near} from 'near-api-js';
import {InMemoryKeyStore} from 'near-api-js/lib/key_stores';
import {FinalExecutionStatus} from 'near-api-js/lib/providers';
import {functionCall, stringifyJsonOrBytes} from 'near-api-js/lib/transaction';
import path from 'path';

import {
  mapAddCouncilOptions,
  mapCreateOptions,
  mapRemoveCouncilOptions,
  SputnikFactoryDaoContract,
  VoteAction,
} from '~/shared/api/near';
import {mapMultiVoteOptions} from '~/shared/api/near/contracts/sputnik-dao/map-multi-vote-options';
import {getNetworkPreset, NetworkId} from '~/shared/api/near/options';
import {env} from '~/shared/config/env';
import {decodeBase64} from '~/shared/lib/base64';

const ACCOUNT_ID = 'rocketobiztestuser';

// 10% quorum for easy voting by proposal
const VOTE_POLICY = {
  add_member_to_role: {
    quorum: '0',
    threshold: [1, 10],
    weight_kind: 'RoleWeight',
  },
  remove_member_from_role: {
    quorum: '0',
    threshold: [1, 10],
    weight_kind: 'RoleWeight',
  },
  call: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  transfer: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  set_vote_token: {
    quorum: '0',
    threshold: [1, 10],
    weight_kind: 'RoleWeight',
  },
  policy: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  config: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  upgrade_self: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  upgrade_remote: {
    quorum: '0',
    threshold: [1, 10],
    weight_kind: 'RoleWeight',
  },
  add_bounty: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  bounty_done: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
  vote: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
};

const createCallbackUrl = (daoAddress: string, daoName: string) => {
  const url = new URL(window.location.toString());
  url.search = `?newDaoAddress=${daoAddress}&newDaoName=${encodeURIComponent(daoName)}`;
  return url.toString();
};

interface FunctionalCallOptions {
  methodName: string;
  args: Uint8Array | object;
  gas: BN;
  deposit: BN;
  stringify?: typeof stringifyJsonOrBytes;
  jsContract?: boolean;
}

// ts-unused-exports:disable-next-line
export class DaoManagement {
  private readonly nearNetworkId: NetworkId;

  private nearConnection: Near | undefined;

  keyStore: InMemoryKeyStore;

  sputnikFactoryDaoContract: SputnikFactoryDaoContract | undefined;

  constructor(nearNetworkId: NetworkId) {
    this.keyStore = new keyStores.InMemoryKeyStore();
    this.nearNetworkId = nearNetworkId;
  }

  createDaoOptions() {
    const randomNumber = Math.floor(
      Math.random() * (99999999999999 - 10000000000000) + 10000000000000,
    );
    const daoName = `dao-roketo-${Date.now()}-${randomNumber}`;
    const addressFromName = decamelize(daoName, {separator: '-'}).replace(/\s+/g, '-');
    return {
      name: daoName,
      address: addressFromName,
    };
  }

  async getNearConnection() {
    if (!this.nearConnection) {
      try {
        const options = getNetworkPreset(this.nearNetworkId);

        this.nearConnection = await connect({
          ...options,
          keyPath: path.join(
            __dirname,
            '../fixtures/',
            this.nearNetworkId,
            `${ACCOUNT_ID}.${this.nearNetworkId}.json`,
          ),
          keyStore: this.keyStore,
        });
      } catch (error) {
        console.error(error);
      }
    }

    return this.nearConnection;
  }

  async getAccount() {
    const nearConnection = await this.getNearConnection();

    const account = await nearConnection?.account(`${ACCOUNT_ID}.${this.nearNetworkId}`);
    if (!account) {
      throw Error('Account not defined');
    }
    return account;
  }

  getDaoContract(account: Account) {
    if (this.sputnikFactoryDaoContract) {
      return this.sputnikFactoryDaoContract;
    }

    this.sputnikFactoryDaoContract = new SputnikFactoryDaoContract(
      account,
      env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME,
    );

    return this.sputnikFactoryDaoContract;
  }

  async createDao() {
    const account = await this.getAccount();

    const contract = this.getDaoContract(account);

    const {name, address} = this.createDaoOptions();

    await contract!.create(
      mapCreateOptions({
        name,
        address,
        // @ts-expect-error doesn't have enough fields
        votePolicy: VOTE_POLICY,
        councilList: [`${ACCOUNT_ID}.${this.nearNetworkId}`],
        callbackUrl: createCallbackUrl(address, name),
      }),
    );

    return name;
  }

  async createDaoWithCouncilList(councilList: string[]) {
    const account = await this.getAccount();
    const contract = this.getDaoContract(account);

    const {name, address} = this.createDaoOptions();

    await contract!.create(
      mapCreateOptions({
        name,
        address,
        // @ts-expect-error doesn't have enough fields
        votePolicy: VOTE_POLICY,
        councilList: [`${ACCOUNT_ID}.${this.nearNetworkId}`, ...councilList],
        callbackUrl: createCallbackUrl(address, name),
      }),
    );

    return name;
  }

  async approveTransactions(account: Account, currentDaoId: string, proposeId: number) {
    const options = mapMultiVoteOptions(proposeId, VoteAction.VoteApprove);

    // @ts-expect-error signAndSendTransaction is protected
    return account.signAndSendTransaction({
      receiverId: `${currentDaoId}.sputnikv2.testnet`,
      // @ts-expect-error gas and deposit should be BN
      actions: [functionCall(options.methodName, options.args, options.gas, options.deposit)],
    });
  }

  async createProposalAndApproveThat(
    account: Account,
    currentDaoId: string,
    {methodName, args, gas, deposit}: FunctionalCallOptions,
  ) {
    return (
      account
        // @ts-expect-error signAndSendTransaction is protected
        .signAndSendTransaction({
          receiverId: `${currentDaoId}.sputnikv2.testnet`,
          actions: [functionCall(methodName, args, gas, deposit)],
        })
        .then((r) => {
          const status = r.status as FinalExecutionStatus;
          if (status.SuccessValue) {
            const proposeId = decodeBase64(status.SuccessValue);
            return Number(proposeId);
          }
          throw Error("Response doesn't have 'status.SuccessValue'");
        })
        .then((proposeId: number) => this.approveTransactions(account, currentDaoId, proposeId))
    );
  }

  async addCouncil(currentDaoId: string, councilAddress: string) {
    const account = await this.getAccount();

    const options = mapAddCouncilOptions({
      description: 'test-call-add-council-in-dao',
      link: '',
      councilAddress,
    });

    // @ts-expect-error gas and deposit in 'options' should be BN
    await this.createProposalAndApproveThat(account, currentDaoId, options);
  }

  async removeCouncil(currentDaoId: string, councilAddress: string) {
    const account = await this.getAccount();
    const options = mapRemoveCouncilOptions({
      description: 'test-call-remove-council-in-dao',
      link: '',
      councilAddress,
    });

    // @ts-expect-error gas and deposit in 'options' should be BN
    await this.createProposalAndApproveThat(account, currentDaoId, options);
  }
}

/** Code example * */
// const daoManagementInstance = new DaoManagement('testnet');
//
// daoManagmentInstance
//   .createDao()
//   .then((currentDaoId: string) => {
//     console.log('was created dao', currentDaoId);
//     return Promise.all([
//       Promise.resolve(currentDaoId),
//       daoManagementInstance.addCouncil(currentDaoId, 'rkate'),
//     ]);
//   })
//   .then(([currentDaoId]: [string]) => {
//     console.log('was added council in dao', currentDaoId);
//     return daoManagementInstance.removeCouncil(currentDaoId, 'rkate');
//   })
//   .then(([currentDaoId]: [string]) => {
//     console.log('was removed council in dao', currentDaoId);
//     return daoManagementInstance.removeCouncil(currentDaoId, 'rkate');
//   })
//   .catch((error) => {
//     console.log(error);
//   });
