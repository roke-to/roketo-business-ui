import {attach, createEvent, createStore, sample} from 'effector';

import {astroApi, Proposal} from '~/shared/api/astro';

import {$daoId} from './dao';

export const $treasuryProposals = createStore<Proposal[]>([]);

export const loadTreasuryProposals = createEvent();

const loadTreasuryProposalsFx = attach({
  source: $daoId,
  async effect(daoId) {
    return astroApi.proposalControllerProposalByAccount(daoId);
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
