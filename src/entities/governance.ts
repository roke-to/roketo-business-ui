import {attach, createEffect, createEvent, createStore, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {astroApi, Proposal} from '~/shared/api/astro';
import {validators} from '~/shared/lib/validators';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

import {$currentDaoId} from './dao';
import {$accountId} from './wallet';

export const $governanceProposals = createStore<Proposal[]>([]);

export const loadGovernanceProposals = createEvent();

export const $governanceProposalLoading = createStore(true);
//  ------------ proposals filter by status ------------

export const changeGovernanceProposalSelectedStatus = createEvent<ProposalStatus>();

export const $governanceSelectedProposalStatus = createStore<ProposalStatus>('all').on(
  changeGovernanceProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals sort by createAt  ------------
export const changeGovernanceProposalSortOrder = createEvent<ProposalSortOrderType>();

export const $governanceProposalSortOrder = createStore<ProposalSortOrderType>('DESC').on(
  changeGovernanceProposalSortOrder,
  (_, sortType) => sortType,
);
//  /------------ proposals sort by createAt ------------
const loadGovernanceProposalsFx = attach({
  source: {
    daoId: $currentDaoId,
    accountId: $accountId,
    sort: $governanceProposalSortOrder,
  },
  async effect({daoId, accountId, sort}) {
    const query = {
      s: JSON.stringify({
        $and: [
          {daoId: {$eq: daoId}},
          {$or: [{kind: {$cont: 'ChangeConfig'}}, {kind: {$cont: 'ChangePolicy'}}]},
        ],
      }),
      limit: 20,
      offset: 0,
      sort: [`createdAt,${sort}`],
      accountId,
    };
    return astroApi.proposalControllerProposals(query);
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

sample({
  clock: changeGovernanceProposalSelectedStatus,
  target: loadGovernanceProposalsFx,
});

sample({
  clock: changeGovernanceProposalSortOrder,
  target: loadGovernanceProposalsFx,
});

sample({
  clock: loadGovernanceProposalsFx.finally,
  fn: () => false,
  target: $governanceProposalLoading,
});

sample({
  clock: loadGovernanceProposalsFx,
  fn: () => true,
  target: $governanceProposalLoading,
});

//  ------------ proposals change policy  ------------

export const changePolicyProposalForm = createForm({
  fields: {
    type: {
      init: 'changePolic',
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

type ChangePolicyProposalFormFields = typeof changePolicyProposalForm['fields'];

export const changePolicyProposalFx = createEffect(
  async (data: FormValues<ChangePolicyProposalFormFields>) => {
    console.log('changePolicy proposal', data);
  },
);
