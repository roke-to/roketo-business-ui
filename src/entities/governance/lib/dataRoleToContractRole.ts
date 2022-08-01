import isEmpty from 'lodash/isEmpty';

import {Role} from '~/shared/api/astro';
import {DaoRole, DefaultVotePolicy} from '~/shared/api/sputnik-dao/proposal';

export interface VotePolicyRequest {
  weight_kind: string;
  quorum: string;
  threshold: number[] | string;
}

export interface ContractRole {
  name: string;
  kind: 'Everyone' | {Group: string[] | null} | {Member: string};
  permissions: string[];
  vote_policy: Record<string, VotePolicyRequest> | {};
}

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
