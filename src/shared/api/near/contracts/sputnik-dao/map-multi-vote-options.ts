import * as nearApi from 'near-api-js';

export type VoteAction = 'VoteApprove' | 'VoteRemove' | 'VoteReject';

export const mapMultiVoteOptions = (proposalId: string, action: VoteAction) => ({
  args: {
    id: proposalId,
    action,
  },
  gas: nearApi.DEFAULT_FUNCTION_CALL_GAS,
  amount: nearApi.utils.format.parseNearAmount('0.1'), // attachec deposit — bond 1e+23 0.1 NEAR,
});
