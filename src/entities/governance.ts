import {attach, createEvent, createStore, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {astroApi, Proposal} from '~/shared/api/astro';
import {getQuorum} from '~/shared/lib/getQuorum';
import {validators} from '~/shared/lib/validators';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

import {$currentDao, $currentDaoId, $sputnikDaoContract} from './dao';
import {$accountId} from './wallet';

// import BN from 'bn.js';

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

export type CouncilListFormFieldItem = {council: string; action: 'delete' | 'add'};

const getCouncilListInitialState = (
  councils: string[],
  accountId: string,
): CouncilListFormFieldItem[] =>
  councils
    .filter((council) => council !== accountId)
    .map((council) => ({council, action: 'delete'}));

const initChangePolicyProposalFormFx = attach({
  source: {
    accountId: $accountId,
    currentDao: $currentDao,
  },
  effect({accountId, currentDao}) {
    if (!currentDao) {
      throw Error('You need create Dao');
    }

    const {
      policy: {
        defaultVotePolicy: {ratio},
      },
    } = currentDao;

    const quorum = getQuorum(ratio);

    return {
      type: 'changePolicy',
      quorum,
      councilAddress: '.near',
      councilList: getCouncilListInitialState(currentDao.council, accountId),
      amount: '1',
      token: 'near',
      description: '',
      link: '',
      tgas: '150',
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
      init: 'changePolicy',
      rules: [validators.required],
    },
    quorum: {
      init: 0 as number,
    },
    councilAddress: {
      init: '.near',
    },
    councilList: {
      init: [] as CouncilListFormFieldItem[],
    },
    amount: {
      init: '1',
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

sample({
  source: initChangePolicyProposalFormFx.doneData,
  target: changePolicyProposalForm.setForm,
});

export type ChangePolicyProposalFormFields = typeof changePolicyProposalForm['fields'];

export const changePolicyProposalFx = attach({
  source: {
    sputnikDaoContract: $sputnikDaoContract,
    accountId: $accountId,
  },
  async effect({sputnikDaoContract, accountId}, data: FormValues<ChangePolicyProposalFormFields>) {
    if (!sputnikDaoContract) {
      // TODO: show error on form
      throw new Error('SputnikDaoContract not initialized');
    }

    console.log('change policy ', sputnikDaoContract, accountId, data);
    // try {
    //   const gas = new BN('300000000000000');
    //   const attachedDeposit = new BN('100000000000000000000000'); // bond 1e+23 0.1 NEAR

    // {"daoId":"extg2.sputnikv2.testnet","description":"aa$$$$","kind":"Transfer","bond":"100000000000000000000000","data":{"token_id":"wrap.testnet","receiver_id":"extg.testnet","amount":"1000000000000000000000000"}
    // await sputnikDaoContract.addProposal({
    //   args: {
    //     proposal: {
    //       description: data.description,
    //       kind: {
    //        ChangePolicy: {
    //          policy: {
    //
    //          }
    //        }
    //       },
    //     },
    //   },
    //   gas,
    //   amount: attachedDeposit,
    // });
    // TODO: redirect to dashboard
    // } catch (err) {
    //   console.log('err', err);
    // }
  },
});

sample({
  source: changePolicyProposalForm.formValidated,
  target: changePolicyProposalFx,
});
