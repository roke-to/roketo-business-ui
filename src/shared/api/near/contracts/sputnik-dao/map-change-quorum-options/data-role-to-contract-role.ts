import isEmpty from 'lodash/isEmpty';

import type {Role} from '~/shared/api/astro';
import type {
  ContractRole,
  DaoRole,
  DefaultVotePolicy,
  VotePolicyRequest,
} from '~/shared/api/near/contracts/sputnik-dao/proposal';

function formatVotePolicy(value: DefaultVotePolicy) {
  return {
    weight_kind: value.weightKind,
    quorum: value.quorum,
    threshold: value.ratio ?? value.weight,
  };
}

function formatVotePolicies(
  data: Record<string, DefaultVotePolicy>,
): Record<string, VotePolicyRequest> {
  return Object.keys(data).reduce((res, key) => {
    const value = data[key];

    res[key] = formatVotePolicy(value);

    return res;
  }, {} as Record<string, VotePolicyRequest>);
}

// @see https://github.com/near-daos/astro-ui/blob/6b64dccc00582e9070ee176c1fc16e33f40392b3/features/groups/helpers.ts#L75
export function dataRoleToContractRole(role: Role): ContractRole {
  const {name, kind, permissions, votePolicy, accountIds, balance} = role as unknown as DaoRole;

  let newKind;

  switch (kind) {
    case 'Group': {
      newKind = {
        Group: accountIds,
      };

      break;
    }
    case 'Member': {
      newKind = {
        Member: balance ?? '1',
      };

      break;
    }
    default: {
      newKind = kind;
    }
  }

  return {
    name,
    kind: newKind,
    permissions,
    vote_policy:
      votePolicy && !isEmpty(votePolicy)
        ? formatVotePolicies(votePolicy)
        : ({} as Record<string, VotePolicyRequest>),
  };
}
