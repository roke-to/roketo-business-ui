import * as nearApi from 'near-api-js';
import {FormValues} from 'effector-forms';

import type {ChangePolicyProposalFormFields} from '~/entities/governance';
import {dataRoleToContractRole} from '~/entities/governance/lib/data-role-to-contract-role';
import {generateVotePolicyForEachProposalType} from '~/entities/governance/lib/generate-vote-policy-for-each-proposal-type';
import {Dao} from '~/shared/api/astro';
import {COUNCIL} from '~/shared/api/near/contracts/contract.constants';

export const mapChangeQuorumOptions = (
  currentDao: Dao,
  formData: FormValues<ChangePolicyProposalFormFields>,
) => {
  const {
    policy: {
      bountyBond,
      proposalBond,
      proposalPeriod,
      defaultVotePolicy: {weightKind, ratio, quorum},
      bountyForgivenessPeriod,
      roles,
    },
  } = currentDao;

  const otherRoles = roles.filter(({name}) => name !== COUNCIL).map(dataRoleToContractRole);

  const indexCouncilRole = currentDao.policy.roles.findIndex(({name}) => name === COUNCIL);

  const {permissions, name, accountIds} = currentDao.policy.roles[indexCouncilRole];

  return {
    args: {
      proposal: {
        description: formData.description,
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
                  vote_policy: generateVotePolicyForEachProposalType(formData.quorum),
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
    gas: nearApi.DEFAULT_FUNCTION_CALL_GAS,
    amount: nearApi.utils.format.parseNearAmount('0.1'), // attachec deposit — bond 1e+23 0.1 NEAR,
  };
};
