import {attach, createEvent, createStore, forward, sample} from 'effector';
import {createForm} from 'effector-forms';

import {sendTransactionsFx} from '~/entities/transactions';
import {astroApi, HttpResponse, Proposal, Token} from '~/shared/api/astro';
import {mapFunctionCallOptions} from '~/shared/api/near/contracts/sputnik-dao/map-function-call-options';
import {mapTransferOptions} from '~/shared/api/near/contracts/sputnik-dao/map-transfer-options';
import {ValuesOfForm} from '~/shared/lib/form';
import {validators} from '~/shared/lib/form/validators';
import {addKindProposalQuery} from '~/shared/lib/requestQueryBuilder/add-kind-proposal-query';
import {addStatusProposalQuery} from '~/shared/lib/requestQueryBuilder/add-status-proposal-query';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

import {$currentDaoId, $sputnikDaoContract} from '../../dao';
import {$accountId} from '../../wallet';

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
    const defaultKindFilterQuery: SFields | SConditionAND = {
      $or: [{kind: {$cont: 'Transfer'}}, {kind: {$cont: 'FunctionCall'}}],
    };

    const search: SFields | SConditionAND = {
      $and: [
        {
          daoId: {
            $eq: daoId,
          },
        },
      ],
    };

    addStatusProposalQuery(search, status);

    addKindProposalQuery(search, kind, defaultKindFilterQuery);

    const query = {
      s: JSON.stringify(search),
      limit: 20,
      offset: 0,
      sort: [`createdAt,${sort}`],
      accountId,
    };

    return astroApi.proposalControllerProposals(query);
  },
});

sample({
  source: sendTransactionsFx.doneData,
  target: loadTreasuryProposalsFx,
});
sample({
  clock: $currentDaoId,
  target: loadTreasuryProposalsFx,
});

sample({
  source: loadTreasuryProposalsFx.doneData,
  fn: (response) => response.data.data,
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
    sputnikDaoContract: $sputnikDaoContract,
  },
  async effect({sputnikDaoContract}, data: ValuesOfForm<typeof createTreasuryProposalForm>) {
    if (!sputnikDaoContract) {
      throw new Error('SputnikDaoContract is not initialized');
    }

    switch (data.type) {
      case 'transfer':
        return sputnikDaoContract.add_proposal(
          mapTransferOptions({
            description: data.description,
            token: 'wrap.testnet',
            amount: '1', // 1 NEAR
            targetAccountId: data.targetAccountId,
          }),
        );
      case 'functionCall':
        return sputnikDaoContract.add_proposal(
          mapFunctionCallOptions({
            description: data.description,
            deposit: data.deposit,
            contractAddress: data.contractAddress,
            contractMethod: data.contractMethod,
            json: data.json,
          }),
        );
      default:
        throw Error(`We don't recognize action for ${data.type}`);
    }
  },
});

forward({
  from: createTreasuryProposalForm.formValidated,
  to: createTreasuryProposalFx,
});
