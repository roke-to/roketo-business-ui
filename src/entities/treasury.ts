import {attach, createEvent, createStore, sample} from 'effector';

import {astroApi, Proposal} from '~/shared/api/astro';

import {$daoId} from './dao';
import {$accountId} from './wallet';

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
