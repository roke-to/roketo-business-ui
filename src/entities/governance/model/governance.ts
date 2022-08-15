import * as nearApi from 'near-api-js';
import {attach, createEvent, createStore, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {astroApi, Proposal} from '~/shared/api/astro';
import {
  mapAddCouncilOptions,
  mapChangeQuorumOptions,
  mapRemoveCouncilOptions,
} from '~/shared/api/near';
import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS,
} from '~/shared/api/near/contracts/contract.constants';
import {getQuorumValueFromDao} from '~/shared/lib/get-quorum-value-from-dao';
import {addStatusProposalQuery} from '~/shared/lib/requestQueryBuilder/add-status-proposal-query';
import {validators} from '~/shared/lib/validators';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

import {SConditionAND, SFields} from '@nestjsx/crud-request';

import {$currentDao, $currentDaoId, $sputnikDaoContract} from '../../dao';
import {$accountId} from '../../wallet';

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
    status: $governanceSelectedProposalStatus,
  },
  async effect({daoId, accountId, sort, status}) {
    const search: SFields | SConditionAND = {
      $and: [
        {daoId: {$eq: daoId}},
        {
          $or: [
            {kind: {$cont: 'ChangeConfig'}},
            {kind: {$cont: 'ChangePolicy'}},
            {kind: {$cont: 'AddMemberToRole'}},
            {kind: {$cont: 'RemoveMemberFromRole'}},
          ],
        },
      ],
    };

    addStatusProposalQuery(search, status);

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
  source: loadGovernanceProposals,
  target: loadGovernanceProposalsFx,
});

sample({
  source: $currentDao,
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

const getCouncilListInitialState = (councils: string[], accountId: string): string[] =>
  councils.filter((council) => council !== accountId);

const initChangePolicyProposalFormFx = attach({
  source: {
    accountId: $accountId,
    currentDao: $currentDao,
  },
  effect({accountId, currentDao}) {
    if (!currentDao) {
      throw Error('You need create Dao');
    }

    const quorum = getQuorumValueFromDao(currentDao);

    console.log(' toNumber()', nearApi);

    return {
      type: 'changeQuorum',
      quorum,
      councilAddress: '.near',
      councilList: getCouncilListInitialState(currentDao.council, accountId),
      amount: ATTACHED_DEPOSIT,
      token: 'near',
      description: '',
      link: '',
      tgas: `${DEFAULT_FUNCTION_CALL_GAS}`,
    };
  },
});

sample({
  source: $currentDao,
  target: initChangePolicyProposalFormFx,
});

export const changePolicyProposalForm = createForm({
  fields: {
    type: {
      init: 'changeQuorum',
      rules: [validators.required],
    },
    quorum: {
      init: 0 as number,
    },
    councilAddress: {
      init: '.near',
      rules: [validators.required],
    },
    councilList: {
      init: [] as string[],
    },
    amount: {
      init: ATTACHED_DEPOSIT,
      rules: [validators.required],
    },
    token: {
      init: 'near',
      rules: [validators.required],
    },
    description: {
      init: '',
      rules: [validators.required],
    },
    link: {
      init: '',
    },
    tgas: {
      init: `${DEFAULT_FUNCTION_CALL_GAS}`,
      rules: [validators.required],
    },
  },
  validateOn: ['submit'],
});

sample({
  source: initChangePolicyProposalFormFx.doneData,
  target: changePolicyProposalForm.setForm,
});

export type ChangePolicyProposalFormFields = typeof changePolicyProposalForm['fields'];

export const changePolicyProposalFx = attach({
  source: {
    sputnikDaoContract: $sputnikDaoContract,
    currentDao: $currentDao,
  },
  async effect({sputnikDaoContract, currentDao}, data: FormValues<ChangePolicyProposalFormFields>) {
    if (!sputnikDaoContract) {
      // TODO: show error on form
      throw new Error('SputnikDaoContract is not initialized');
    }
    if (!currentDao) {
      // TODO: show error on form
      throw new Error('You should create dao');
    }

    try {
      switch (data.type) {
        case 'removeCouncil':
          await sputnikDaoContract.add_proposal(mapRemoveCouncilOptions(currentDao, data));
          break;
        case 'addCouncil':
          await sputnikDaoContract.add_proposal(mapAddCouncilOptions(currentDao, data));
          break;
        case 'changeQuorum':
          await sputnikDaoContract.add_proposal(mapChangeQuorumOptions(currentDao, data));
          break;
        default:
          throw Error(`We don't recognize action for ${data.type}`);
      }
    } catch (err) {
      console.log('change policy error', err);
    }
  },
});

sample({
  source: changePolicyProposalForm.formValidated,
  target: changePolicyProposalFx,
});
