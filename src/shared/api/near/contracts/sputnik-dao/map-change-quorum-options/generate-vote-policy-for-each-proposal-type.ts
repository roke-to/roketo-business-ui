import type {DaoVotePolicy} from '~/shared/api/near/contracts/sputnik-dao/proposal.types';

// @see https://github.com/near-daos/astro-ui/blob/6b64dccc00582e9070ee176c1fc16e33f40392b3/types/proposal.ts#L26
const ProposalType = {
  AddMemberToRole: 'AddMemberToRole',
  RemoveMemberFromRole: 'RemoveMemberFromRole',
  FunctionCall: 'FunctionCall',
  Transfer: 'Transfer',
  SetStakingContract: 'SetStakingContract',
  ChangePolicy: 'ChangePolicy',
  ChangeConfig: 'ChangeConfig',
  UpgradeSelf: 'UpgradeSelf',
  UpgradeRemote: 'UpgradeRemote',
  AddBounty: 'AddBounty',
  BountyDone: 'BountyDone',
  Vote: 'Vote',
};

// @see https://github.com/near-daos/astro-ui/blob/6b64dccc00582e9070ee176c1fc16e33f40392b3/utils/dataConverter.ts#L3
const APP_TO_CONTRACT_PROPOSAL_TYPE = {
  [ProposalType.ChangeConfig]: 'config',
  [ProposalType.ChangePolicy]: 'policy',
  [ProposalType.AddMemberToRole]: 'add_member_to_role',
  [ProposalType.RemoveMemberFromRole]: 'remove_member_from_role',
  [ProposalType.FunctionCall]: 'call',
  [ProposalType.UpgradeSelf]: 'upgrade_self',
  [ProposalType.UpgradeRemote]: 'upgrade_remote',
  [ProposalType.Transfer]: 'transfer',
  [ProposalType.SetStakingContract]: 'set_vote_token',
  [ProposalType.AddBounty]: 'add_bounty',
  [ProposalType.BountyDone]: 'bounty_done',
  [ProposalType.Vote]: 'vote',
};

// @see https://github.com/near-daos/astro-ui/blob/6b64dccc00582e9070ee176c1fc16e33f40392b3/features/groups/helpers.ts#L168
function getThreshold(value: number): [number, number] {
  const fraction = value / 100;
  const gcd = (a: number, b: number): number => {
    if (b < 0.0000001) {
      return a;
    } // Since there is a limited precision we need to limit the value.

    return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
  };

  const len = fraction.toString().length - 2;

  let denominator = 10 ** len;
  let numerator = fraction * denominator;

  const divisor = gcd(numerator, denominator); // Should be 5

  numerator /= divisor; // Should be 687
  denominator /= divisor; // Should be 2000

  return [numerator, denominator];
}

// @see https://github.com/near-daos/astro-ui/blob/6b64dccc00582e9070ee176c1fc16e33f40392b3/features/groups/helpers.ts#L191
export function generateVotePolicyForEachProposalType(
  quorum: number,
): Record<string, DaoVotePolicy> {
  const policy: Record<string, DaoVotePolicy> = {};

  const threshold = getThreshold(quorum);

  Object.values(ProposalType).forEach((type) => {
    const proposalLabel = APP_TO_CONTRACT_PROPOSAL_TYPE[type];

    policy[proposalLabel] = {
      quorum: '0',
      threshold,
      // @ts-ignore
      weight_kind: 'RoleWeight',
    };
  });

  return policy;
}
