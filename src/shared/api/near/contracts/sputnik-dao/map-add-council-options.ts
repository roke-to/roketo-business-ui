import * as nearApi from 'near-api-js';

import {Dao} from '~/shared/api/astro';
import {
  ATTACHED_DEPOSIT,
  COUNCIL,
  DATA_SEPARATOR,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import type {ChangePolicyProposalFormValues} from '~/shared/api/near/contracts/incoming-options.types';

export const mapAddCouncilOptions = (
  currentDao: Dao,
  formData: ChangePolicyProposalFormValues,
) => ({
  args: {
    proposal: {
      description: `${formData.description}${DATA_SEPARATOR}${formData.link}`,
      kind: {
        AddMemberToRole: {
          member_id: formData.councilAddress,
          role: COUNCIL,
        },
      },
    },
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN,
  amount: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT), // attached deposit — bond 1e+23 0.1 NEAR,
});
