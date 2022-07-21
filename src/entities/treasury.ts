import {attach, createEvent, createStore, sample} from 'effector';

import {astroApi, HttpResponse, Proposal, ProposalKindSwaggerDto, Token} from '~/shared/api/astro';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

import {$daoId} from './dao';
import {$accountId} from './wallet';

// ------------ proposals ------------

export const $treasuryProposals = createStore<Proposal[]>([]);

export const loadTreasuryProposals = createEvent();

// /------------ proposals ------------

//  ------------ proposals filter by status ------------
export type TreasuryProposalStatus = 'all' | 'active' | 'approved' | 'failed';

export const changeTreasuryProposalSelectedStatus = createEvent<TreasuryProposalStatus>();

export const $treasurySelectedProposalStatus = createStore<TreasuryProposalStatus>('all').on(
  changeTreasuryProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals filter by kind ------------
export const changeTreasuryProposalSelectedKind = createEvent<ProposalKindFilterType>();

export type ProposalKindFilterType = ProposalKindSwaggerDto['type'] | 'Any';

export const $treasurySelectedProposalKind = createStore<ProposalKindFilterType>('Transfer').on(
  changeTreasuryProposalSelectedKind,
  (_, proposalKind) => proposalKind,
);
//  /------------ proposals filter by kind ------------

//  ------------ proposals sort by createAt  ------------
export const changeTreasuryProposalSortOrder = createEvent<ProposalSortOrderType>();

export type ProposalSortOrderType = 'ASC' | 'DESC';

export const $treasuryProposalSortOrder = createStore<ProposalSortOrderType>('DESC').on(
  changeTreasuryProposalSortOrder,
  (_, sortType) => sortType,
);
//  /------------ proposals sort by createAt ------------

const loadTreasuryProposalsFx = attach({
  source: {
    daoId: $daoId,
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
  clock: $daoId,
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

// ------------- tokens --------------

export const $tokenBalances = createStore<Array<Token>>([]);

export const loadTokenBalances = createEvent();

const loadTokenBalancesFx = attach({
  source: {
    daoId: $daoId,
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
  clock: $daoId,
  target: loadTokenBalancesFx,
});

sample({
  source: loadTokenBalancesFx.doneData,
  fn: (response) => response.data,
  target: $tokenBalances,
});
