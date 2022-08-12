import * as nearApi from 'near-api-js';

import {VoteAction} from '~/shared/api/near';

export const mapMultiVoteOptions = (proposalId: number, action: VoteAction) => ({
  args: {
    id: proposalId,
    action,
  },
  gas: nearApi.DEFAULT_FUNCTION_CALL_GAS,
});
