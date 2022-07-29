import BN from 'bn.js';
import {attach, createEvent, createStore, forward, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {astroApi, HttpResponse, Proposal, Token} from '~/shared/api/astro';
import {validators} from '~/shared/lib/validators';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

import {$currentDaoId, $sputnikDaoContract} from './dao';
import {$accountId} from './wallet';

// ------------ proposals ------------

export const $treasuryProposals = createStore<Proposal[]>([]);

export const loadTreasuryProposals = createEvent();

export const $treasuryProposalLoading = createStore(true);

// /------------ proposals ------------

//  ------------ proposals filter by status ------------

export const changeTreasuryProposalSelectedStatus = createEvent<ProposalStatus>();

export const $treasurySelectedProposalStatus = createStore<ProposalStatus>('all').on(
  changeTreasuryProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals filter by kind ------------
export const changeTreasuryProposalSelectedKind = createEvent<ProposalKindFilterType>();

export const $treasurySelectedProposalKind = createStore<ProposalKindFilterType>('Transfer').on(
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
    const search: SFields | SConditionAND = {
      $and: [
        {
          kind: {
            $cont: 'Transfer',
            $excl: 'ChangePolicy',
          },
        },
      ],
    };

    switch (status) {
      case 'active':
        search.$and?.push({
          status: {
            $eq: 'InProgress',
          },
        });
        break;
      case 'approved':
        search.$and?.push({
          status: {
            $eq: 'Approved',
          },
        });
        break;
      case 'failed':
        search.$and?.push({
          status: {
            $in: ['Rejected', 'Failed'],
          },
        });
        break;
      case 'all':
      default:
        break;
    }

    switch (kind) {
      case 'Transfer':
        search.$and?.push({
          kind: {
            $cont: 'Transfer',
            $excl: 'ChangePolicy',
          },
        });
        break;
      case 'ChangeConfig':
      case 'ChangePolicy':
      case 'AddMemberToRole':
      case 'RemoveMemberFromRole':
      case 'FunctionCall':
      case 'UpgradeSelf':
      case 'SetStakingContract':
      case 'AddBounty':
      case 'BountyDone':
      case 'Vote':
        search.$and?.push({
          kind: {
            $cont: kind,
          },
        });
        break;
      case 'Any':
      default:
        break;
    }

    const query = {
      s: JSON.stringify(search),
      limit: 20,
      offset: 0,
      sort: [`createdAt,${sort}`],
      accountId,
    };

    return astroApi.proposalControllerProposalByAccount(daoId, query);
  },
});

sample({
  source: loadTreasuryProposals,
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

export const createProposalForm = createForm({
  fields: {
    type: {
      init: 'transfer',
      rules: [validators.required],
    },
    target: {
      init: '',
      rules: [validators.required],
    },
    amount: {
      init: '',
      rules: [validators.required],
    },
    token: {
      init: 'near',
      rules: [validators.required],
    },
    description: {
      init: '',
    },
    link: {
      init: '',
    },
    tgas: {
      init: '150',
      rules: [validators.required],
    },
  },
  validateOn: ['submit'],
});

type CreateProposalFormFields = typeof createProposalForm['fields'];

export const createProposalFx = attach({
  source: {
    sputnikDaoContract: $sputnikDaoContract,
  },
  async effect({sputnikDaoContract}, data: FormValues<CreateProposalFormFields>) {
    if (!sputnikDaoContract) {
      throw new Error('SputnikDaoContract is not initialized');
    }

    await sputnikDaoContract.add_proposal({
      args: {
        proposal: {
          description: data.description,
          kind: {
            Transfer: {
              token_id: 'wrap.testnet',
              amount: '1000000000000000000000000', // 1 NEAR
              receiver_id: data.target,
            },
          },
        },
      },
      gas: new BN('300000000000000'),
      amount: new BN('100000000000000000000000'), // attachec deposit — bond 1e+23 0.1 NEAR,
    });
  },
});

forward({
  from: createProposalForm.formValidated,
  to: createProposalFx,
});
