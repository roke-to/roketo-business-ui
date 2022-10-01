import * as nearApi from 'near-api-js';
import {attach, createEvent, createStore, forward, sample} from 'effector';
import {createForm} from 'effector-forms';
import {Get} from 'type-fest';

import {sendTransactionsFx} from '~/entities/transactions';
import {astroApi, HttpResponse, Proposal, Token} from '~/shared/api/astro';
import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import {mapFunctionCallOptions} from '~/shared/api/near/contracts/sputnik-dao/map-function-call-options';
import {mapTransferOptions} from '~/shared/api/near/contracts/sputnik-dao/map-transfer-options';
import {ValuesOfForm} from '~/shared/lib/form';
import {validators} from '~/shared/lib/form/validators';
import {addKindProposalQuery} from '~/shared/lib/requestQueryBuilder/add-kind-proposal-query';
import {addStatusProposalQuery} from '~/shared/lib/requestQueryBuilder/add-status-proposal-query';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';

import {SignAndSendTransactionsParams} from '@near-wallet-selector/core/lib/wallet';
import {SConditionAND} from '@nestjsx/crud-request';

import {$accountId, $currentDaoId, $walletSelector} from '../../wallet';

// ------------ proposals ------------

export const $treasuryProposals = createStore<Proposal[]>([]);

export const $treasuryProposalLoading = createStore(true);

// /------------ proposals ------------

//  ------------ proposals filter by status ------------

export const changeTreasuryProposalSelectedStatus = createEvent<ProposalStatusFilterType>();

export const $treasurySelectedProposalStatus = createStore<ProposalStatusFilterType>('all').on(
  changeTreasuryProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals filter by kind ------------
export const changeTreasuryProposalSelectedKind = createEvent<ProposalKindFilterType>();

export const $treasurySelectedProposalKind = createStore<ProposalKindFilterType>('Any').on(
  changeTreasuryProposalSelectedKind,
  (_, proposalKind) => proposalKind,
);
//  /------------ proposals filter by kind ------------

//  ------------ proposals sort by createAt  ------------
export const changeTreasuryProposalSortOrder = createEvent<ProposalSortOrderType>();

export const $treasuryProposalSortOrder = createStore<ProposalSortOrderType>('DESC').on(
  changeTreasuryProposalSortOrder,
  (_, sortType) => sortType,
);
//  /------------ proposals sort by createAt ------------

const loadTreasuryProposalsFx = attach({
  source: {
    daoId: $currentDaoId,
    accountId: $accountId,
    status: $treasurySelectedProposalStatus,
    kind: $treasurySelectedProposalKind,
    sort: $treasuryProposalSortOrder,
  },
  async effect({daoId, accountId, status, kind, sort}) {
    const defaultKindFilterQuery = 'FunctionCall,Transfer';

    // https://github.com/nestjsx/crud/wiki/Requests#filter-conditions
    const search: SConditionAND = {
      $and: [
        {
          description: {$excl: 'ProposeCreateRoketoStream'},
        },
        {
          description: {$excl: 'ProposePauseRoketoStream'},
        },
        {
          description: {$excl: 'ProposeStartRoketoStream'},
        },
        {
          description: {$excl: 'ProposeStopRoketoStream'},
        },
        {
          description: {$excl: 'ProposeRoketoStreamWithdraw'},
        },
      ],
    };

    const query = {
      ...addStatusProposalQuery(status),
      search: JSON.stringify(search),
      limit: 20,
      offset: 0,
      accountId,
      dao: daoId,
      type: addKindProposalQuery(kind, defaultKindFilterQuery),
      orderBy: 'createdAt',
      sort,
    };

    return astroApi.proposalControllerProposals(query);
  },
});

sample({
  source: sendTransactionsFx.doneData,
  filter() {
    return window.location.pathname.includes('treasury');
  },
  target: loadTreasuryProposalsFx,
});
sample({
  clock: $currentDaoId,
  target: loadTreasuryProposalsFx,
});

sample({
  source: loadTreasuryProposalsFx.doneData,
  fn: (response) => response.data.data as unknown as Proposal[],
  target: $treasuryProposals,
});

sample({
  clock: changeTreasuryProposalSelectedStatus,
  target: loadTreasuryProposalsFx,
});

sample({
  clock: changeTreasuryProposalSelectedKind,
  target: loadTreasuryProposalsFx,
});

sample({
  clock: changeTreasuryProposalSortOrder,
  target: loadTreasuryProposalsFx,
});
sample({
  clock: loadTreasuryProposalsFx.finally,
  fn: () => false,
  target: $treasuryProposalLoading,
});
sample({
  clock: loadTreasuryProposalsFx,
  fn: () => true,
  target: $treasuryProposalLoading,
});

// ------------- tokens --------------

export const $tokenBalances = createStore<Array<Token>>([]);

export const loadTokenBalances = createEvent();

const loadTokenBalancesFx = attach({
  source: {
    daoId: $currentDaoId,
  },
  async effect({daoId}) {
    // TODO: remove after PR https://github.com/near-daos/astro-api-gateway/pull/386 merged
    // and astro-api regenerated
    return astroApi.tokenControllerTokensByDao(daoId) as unknown as Promise<
      HttpResponse<Array<Token>>
    >;
  },
});

sample({
  source: loadTokenBalances,
  target: loadTokenBalancesFx,
});
sample({
  clock: $currentDaoId,
  target: loadTokenBalancesFx,
});

sample({
  source: loadTokenBalancesFx.doneData,
  fn: (response) => response.data,
  target: $tokenBalances,
});

//  ------------ proposals create  ------------

export const createTreasuryProposalForm = createForm({
  fields: {
    type: {
      init: 'transfer',
      rules: [validators.required({if: (form) => form.type === 'transfer'})],
    },
    targetAccountId: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'transfer'})],
    },
    amount: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'transfer'})],
    },
    token: {
      init: 'NEAR',
      rules: [validators.required()],
    },
    contractAddress: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'functionCall'})],
    },
    contractMethod: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'functionCall'})],
    },
    json: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'functionCall'})],
    },
    deposit: {
      init: '0',
    },
    description: {
      init: '',
    },
    link: {
      init: '',
    },
    tgas: {
      init: '150',
      rules: [validators.required()],
    },
  },
  validateOn: ['submit'],
});

export const createTreasuryProposalFx = attach({
  source: {
    currentDaoId: $currentDaoId,
    walletSelector: $walletSelector,
    tokenBalances: $tokenBalances,
  },
  async effect(
    {currentDaoId, walletSelector, tokenBalances},
    data: ValuesOfForm<typeof createTreasuryProposalForm>,
  ) {
    if (!walletSelector) {
      throw new Error('walletSelector is not initialized');
    }

    const token = tokenBalances.find((t) => t.id === data.token);

    if (!token) {
      throw new Error(`Token ${data.token} not found`);
    }

    const wallet = await walletSelector.wallet();

    // collect transactions for safe transfer
    // https://github.com/near-daos/astro-ui/blob/368a710439c907ff5295625e98e87b5685319df3/services/sputnik/SputnikNearService/services/NearService.ts#L481
    const transactions: Get<SignAndSendTransactionsParams, 'transactions'> = [];

    switch (data.type) {
      case 'transfer': {
        // reserve storage in contract of token
        if (token.id !== 'NEAR') {
          transactions.push({
            receiverId: token.id,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'storage_deposit',
                  args: {
                    account_id: data.targetAccountId,
                    registration_only: true,
                  },
                  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
                  // minimal deposit is 0.1 NEAR
                  deposit: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT)!,
                },
              },
            ],
          });
        }

        transactions.push({
          receiverId: currentDaoId,
          actions: [
            {
              type: 'FunctionCall',
              params: mapTransferOptions({
                description: data.description,
                token: token.id === 'NEAR' ? '' : token.id,
                amount: data.amount,
                tokenDecimals: token.decimals,
                targetAccountId: data.targetAccountId,
                link: data.link,
              }),
            },
          ],
        });

        return wallet.signAndSendTransactions({
          transactions,
        });
      }
      case 'functionCall':
        transactions.push({
          receiverId: currentDaoId,
          actions: [
            {
              type: 'FunctionCall',
              params: mapFunctionCallOptions({
                description: data.description,
                deposit: data.deposit,
                contractAddress: data.contractAddress,
                contractMethod: data.contractMethod,
                json: data.json,
                link: data.link,
              }),
            },
          ],
        });

        return wallet.signAndSendTransactions({
          transactions,
        });
      default:
        throw Error(`We don't recognize action for ${data.type}`);
    }
  },
});

forward({
  from: createTreasuryProposalForm.formValidated,
  to: createTreasuryProposalFx,
});
