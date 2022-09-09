import * as nearApi from 'near-api-js';

import {Dao} from '~/shared/api/astro';
import {
  ATTACHED_DEPOSIT,
  COUNCIL,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import {dataRoleToContractRole} from '~/shared/api/near/contracts/sputnik-dao/map-change-quorum-options/data-role-to-contract-role';
import {generateVotePolicyForEachProposalType} from '~/shared/api/near/contracts/sputnik-dao/map-change-quorum-options/generate-vote-policy-for-each-proposal-type';

import {encodeDescription} from '../proposal-format';

export const mapChangeQuorumOptions = (
  currentDao: Dao,
  formData: {
    description: string;
    link: string;
    quorum: number;
  },
) => {
  const {
    bountyBond,
    proposalBond,
    proposalPeriod,
    defaultVotePolicy,
    bountyForgivenessPeriod,
    roles,
  } = currentDao.policy;
  const {weightKind, ratio, quorum} = defaultVotePolicy;

  const otherRoles = roles.filter(({name}) => name !== COUNCIL).map(dataRoleToContractRole);

  const indexCouncilRole = currentDao.policy.roles.findIndex(({name}) => name === COUNCIL);

  const {permissions, name, accountIds} = currentDao.policy.roles[indexCouncilRole];

  return {
    args: {
      proposal: {
        description: encodeDescription({
          description: formData.description,
          link: formData.link,
        }),
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
    gas: DEFAULT_FUNCTION_CALL_GAS_BN,
    amount: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT), // attached deposit — bond 1e+23 0.1 NEAR,
  };
};
