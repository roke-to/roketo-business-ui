import * as nearApi from 'near-api-js';

import {Action} from '~/shared/api/near';

export const mapMultiVoteOptions = (proposalId: number, action: Action) => ({
  args: {
    id: proposalId,
    action,
  },
  gas: nearApi.DEFAULT_FUNCTION_CALL_GAS,
});
