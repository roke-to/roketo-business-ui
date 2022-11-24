import {VoteAction} from '~/shared/api/near';
import {DEFAULT_FUNCTION_CALL_GAS_BN} from '~/shared/api/near/contracts/contract.constants';

export const mapMultiVoteOptions = (proposalId: number, action: VoteAction) => ({
  methodName: 'act_proposal',
  args: {
    id: proposalId,
    action,
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
  deposit: '0',
});
