import * as nearApi from 'near-api-js';

import {
  ATTACHED_DEPOSIT,
  COUNCIL,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';

import {FunctionCallAction} from '@near-wallet-selector/core/lib/wallet/transactions.types';

import {encodeDescription} from './proposal-format';

export const mapRemoveCouncilOptions = (formData: {
  description: string;
  link: string;
  councilAddress: string;
}): FunctionCallAction['params'] => ({
  methodName: 'add_proposal',
  args: {
    proposal: {
      description: encodeDescription({
        description: formData.description,
        link: formData.link,
        variant: 'ProposeRemoveMember',
      }),
      kind: {
        RemoveMemberFromRole: {
          member_id: formData.councilAddress,
          role: COUNCIL,
        },
      },
    },
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
  deposit: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT)!, // attached deposit — bond 1e+23 0.1 NEAR,
});
