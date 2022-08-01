import BN from 'bn.js';
import {attach, createEvent, createStore, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {dataRoleToContractRole} from '~/entities/governance/lib/dataRoleToContractRole';
import {generateVotePolicyForEachProposalType} from '~/entities/governance/lib/generateVotePolicyForEachProposalType';
import {astroApi, Proposal} from '~/shared/api/astro';
import {getQuorum} from '~/shared/lib/getQuorum';
import {validators} from '~/shared/lib/validators';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatus} from '~/shared/types/proposal-status';

import {$currentDao, $currentDaoId, $sputnikDaoContract} from '../dao';
import {$accountId} from '../wallet';

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
          {
            $or: [
              {kind: {$cont: 'ChangeConfig'}},
              {kind: {$cont: 'ChangePolicy'}},
              {kind: {$cont: 'AddMemberToRole'}},
              {kind: {$cont: 'RemoveMemberFromRole'}},
            ],
          },
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
      rules: [validators.required],
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
    currentDao: $currentDao,
  },
  async effect(
    {sputnikDaoContract, accountId, currentDao},
    data: FormValues<ChangePolicyProposalFormFields>,
  ) {
    if (!sputnikDaoContract) {
      // TODO: show error on form
      throw new Error('SputnikDaoContract is not initialized');
    }
    if (!currentDao) {
      // TODO: show error on form
      throw new Error('You should create dao');
    }

    console.log('change policy ', sputnikDaoContract, accountId, data);

    const createdProposals: Promise<void>[] = [];

    const updatedCouncilList = data.councilList.reduce(
      (acc, current) => {
        if (currentDao.council.includes(current.council) && current.action === 'add') {
          acc.RemoveMemberFromRole.push(current.council);
        }
        if (!currentDao.council.includes(current.council) && current.action === 'delete') {
          acc.AddMemberToRole.push(current.council);
        }
        return acc;
      },
      {RemoveMemberFromRole: [] as string[], AddMemberToRole: [] as string[]},
    );

    console.log('updatedCouncilList', updatedCouncilList);

    const gas = new BN('300000000000000');
    const gasForChangeQuorum = new BN('230000000000000');
    const attachedDeposit = new BN('100000000000000000000000'); // bond 1e+23 0.1 NEAR

    updatedCouncilList.RemoveMemberFromRole.forEach((council) => {
      createdProposals.push(
        sputnikDaoContract.addProposal({
          args: {
            proposal: {
              description: data.description,
              kind: {
                RemoveMemberFromRole: {
                  member_id: council,
                  role: 'council',
                },
              },
            },
          },
          gas,
          amount: attachedDeposit,
        }),
      );
    });

    updatedCouncilList.AddMemberToRole.forEach((council) => {
      createdProposals.push(
        sputnikDaoContract.addProposal({
          args: {
            proposal: {
              description: data.description,
              kind: {
                AddMemberToRole: {
                  member_id: council,
                  role: 'council',
                },
              },
            },
          },
          gas,
          amount: attachedDeposit,
        }),
      );
    });

    // TODO change condition currentDao.policy.defaultVotePolicy.quorum
    if (data.quorum !== 50) {
      const {
        policy: {
          bountyBond,
          proposalBond,
          proposalPeriod,
          defaultVotePolicy: {weightKind, ratio, quorum},
          bountyForgivenessPeriod,
        },
      } = currentDao;

      const otherRoles = currentDao.policy.roles
        .filter(({name}) => name !== 'council')
        .map(dataRoleToContractRole);

      const indexCouncilRole = currentDao.policy.roles.findIndex(({name}) => name === 'council');

      const {permissions, name, accountIds} = currentDao.policy.roles[indexCouncilRole];

      createdProposals.push(
        sputnikDaoContract.addProposal({
          args: {
            proposal: {
              description: data.description,
              kind: {
                ChangePolicy: {
                  policy: {
                    roles: [
                      ...otherRoles,
                      {
                        name,
                        kind: {
                          Group: accountIds,
                        },
                        permissions,
                        vote_policy: generateVotePolicyForEachProposalType(data.quorum),
                      },
                    ],
                    default_vote_policy: {
                      quorum,
                      threshold: ratio,
                      weight_kind: weightKind,
                    },
                    proposal_bond: proposalBond,
                    proposal_period: proposalPeriod,
                    bounty_bond: bountyBond,
                    bounty_forgiveness_period: bountyForgivenessPeriod,
                  },
                },
              },
            },
          },
          gas: gasForChangeQuorum,
          amount: attachedDeposit,
        }),
      );
    }

    try {
      await Promise.all(createdProposals);
    } catch (err) {
      console.log('change policy error', err);
    }
  },
});

sample({
  source: changePolicyProposalForm.formValidated,
  target: changePolicyProposalFx,
});
