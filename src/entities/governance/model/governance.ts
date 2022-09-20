import {attach, createEffect, createEvent, createStore, forward, sample} from 'effector';
import {createForm} from 'effector-forms';

import {sendTransactionsFx} from '~/entities/transactions';
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
import {isAccountExist} from '~/shared/api/near/is-account-exists';
import {validators, ValuesOfForm} from '~/shared/lib/form';
import {getQuorumValueFromDao} from '~/shared/lib/get-quorum-value';
import {addKindProposalQuery} from '~/shared/lib/requestQueryBuilder/add-kind-proposal-query';
import {addStatusProposalQuery} from '~/shared/lib/requestQueryBuilder/add-status-proposal-query';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';

import {FunctionCallAction} from '@near-wallet-selector/core/lib/wallet/transactions.types';
import {SConditionAND, SFields} from '@nestjsx/crud-request';

import {$currentDao} from '../../dao';
import {$accountId, $currentDaoId, $walletSelector} from '../../wallet';

export const $governanceProposals = createStore<Proposal[]>([]);

export const $governanceProposalLoading = createStore(true);
//  ------------ proposals filter by status ------------

export const changeGovernanceProposalSelectedStatus = createEvent<ProposalStatusFilterType>();

export const $governanceSelectedProposalStatus = createStore<ProposalStatusFilterType>('all').on(
  changeGovernanceProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals filter by kind ------------
export const changeGovernanceProposalSelectedKind = createEvent<ProposalKindFilterType>();

export const $governanceSelectedProposalKind = createStore<ProposalKindFilterType>('Any').on(
  changeGovernanceProposalSelectedKind,
  (_, proposalKind) => proposalKind,
);
//  /------------ proposals filter by kind ------------

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
    kind: $governanceSelectedProposalKind,
  },
  async effect({daoId, accountId, sort, status, kind}) {
    const defaultKindFilterQuery: SFields | SConditionAND = {
      $or: [
        {kind: {$cont: 'ChangeConfig'}},
        {kind: {$cont: 'ChangePolicy'}},
        {kind: {$cont: 'AddMemberToRole'}},
        {kind: {$cont: 'RemoveMemberFromRole'}},
      ],
    };

    const search: SFields | SConditionAND = {
      $and: [{daoId: {$eq: daoId}}],
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
  clock: changeGovernanceProposalSelectedKind,
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

    return {
      type: 'changeQuorum',
      quorum: String(quorum),
      councilAddress: '',
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
      rules: [validators.required()],
    },
    quorum: {
      init: '0',
    },
    councilAddress: {
      init: '',
      rules: [validators.required({if: (form) => form.type !== 'changeQuorum'})],
    },
    councilList: {
      init: [] as string[],
    },
    amount: {
      init: ATTACHED_DEPOSIT,
      rules: [validators.required()],
    },
    token: {
      init: 'near',
      rules: [validators.required()],
    },
    description: {
      init: '',
      rules: [validators.required()],
    },
    link: {
      init: '',
    },
    tgas: {
      init: `${DEFAULT_FUNCTION_CALL_GAS}`,
      rules: [validators.required()],
    },
  },
  validateOn: ['submit'],
});

sample({
  source: initChangePolicyProposalFormFx.doneData,
  target: changePolicyProposalForm.setForm,
});

export const changePolicyProposalFx = attach({
  source: {
    walletSelector: $walletSelector,
    currentDao: $currentDao,
  },
  async effect({walletSelector, currentDao}, data: ValuesOfForm<typeof changePolicyProposalForm>) {
    if (!walletSelector) {
      // TODO: show error on form
      throw new Error('walletSelector is not initialized');
    }
    if (!currentDao) {
      // TODO: show error on form
      throw new Error('You should create dao');
    }

    const wallet = await walletSelector.wallet();

    const actions: Array<FunctionCallAction> = [];

    switch (data.type) {
      case 'removeCouncil':
        actions.push({
          type: 'FunctionCall',
          params: mapRemoveCouncilOptions(currentDao, data),
        });
        break;
      case 'addCouncil':
        actions.push({
          type: 'FunctionCall',
          params: mapAddCouncilOptions(currentDao, data),
        });
        break;
      case 'changeQuorum':
        actions.push({
          type: 'FunctionCall',
          params: mapChangeQuorumOptions(currentDao, {...data, quorum: Number(data.quorum)}),
        });
        break;
      default:
        throw Error(`We don't recognize action for ${data.type}`);
    }

    return wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: currentDao.id,
          actions,
        },
      ],
    });
  },
});

sample({
  source: changePolicyProposalForm.formValidated,
  target: changePolicyProposalFx,
});

export const $isCouncilExists = createStore(false);
const isCouncilExistsFx = createEffect(async (accountId: string) => isAccountExist(accountId));

forward({
  from: changePolicyProposalForm.fields.councilAddress.$value,
  to: isCouncilExistsFx,
});

forward({
  from: isCouncilExistsFx.doneData,
  to: $isCouncilExists,
});
