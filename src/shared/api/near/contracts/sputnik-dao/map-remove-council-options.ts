import * as nearApi from 'near-api-js';

import {Dao} from '~/shared/api/astro';
import {COUNCIL} from '~/shared/api/near/contracts/contract.constants';
import type {ChangePolicyProposalFormValues} from '~/shared/api/near/contracts/incoming-options.types';

export const mapRemoveCouncilOptions = (
  currentDao: Dao,
  formData: ChangePolicyProposalFormValues,
) => ({
  args: {
    proposal: {
      description: formData.description,
      kind: {
        RemoveMemberFromRole: {
          member_id: formData.councilAddress,
          role: COUNCIL,
        },
      },
    },
  },
  gas: nearApi.DEFAULT_FUNCTION_CALL_GAS,
  amount: nearApi.utils.format.parseNearAmount('0.1'), // attachec deposit — bond 1e+23 0.1 NEAR,
});
