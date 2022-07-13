import {attach, createEvent, createStore, sample} from 'effector';

import {astroApi, HttpResponse, Proposal, Token} from '~/shared/api/astro';

import {$daoId} from './dao';
import {$accountId} from './wallet';

// ------------ proposals ------------

export const $treasuryProposals = createStore<Proposal[]>([]);

export const loadTreasuryProposals = createEvent();

const loadTreasuryProposalsFx = attach({
  source: {
    daoId: $daoId,
    accountId: $accountId,
  },
  async effect({daoId, accountId}) {
    const query = {
      s: JSON.stringify({$and: [{kind: {$cont: 'Transfer'}}]}),
      limit: 20,
      offset: 0,
      sort: ['createdAt,DESC'],
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
  source: loadTreasuryProposalsFx.doneData,
  fn: (response) => response.data.data,
  target: $treasuryProposals,
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
  source: loadTokenBalancesFx.doneData,
  fn: (response) => response.data,
  target: $tokenBalances,
});
