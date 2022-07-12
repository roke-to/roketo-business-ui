import {attach, createEvent, createStore, sample} from 'effector';

import {astroApi, Proposal} from '~/shared/api/astro';

import {$daoId} from './dao';
import {$accountId} from './wallet';

export const $governanceProposals = createStore<Proposal[]>([]);

export const loadGovernanceProposals = createEvent();

const loadGovernanceProposalsFx = attach({
  source: {
    daoId: $daoId,
    accountId: $accountId,
  },
  async effect({daoId, accountId}) {
    const query = {
      s: JSON.stringify({
        $and: [{$or: [{kind: {$cont: 'ChangeConfig'}}, {kind: {$cont: 'ChangePolicy'}}]}],
      }),
      limit: 20,
      offset: 0,
      sort: ['createdAt,DESC'],
      accountId,
    };
    return astroApi.proposalControllerProposalByAccount(daoId, query);
  },
});

sample({
  source: loadGovernanceProposals,
  target: loadGovernanceProposalsFx,
});

sample({
  source: loadGovernanceProposalsFx.doneData,
  fn: (response) => response.data.data,
  target: $governanceProposals,
});
