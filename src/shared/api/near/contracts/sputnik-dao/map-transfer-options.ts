import * as nearApi from 'near-api-js';

import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';

import {ChangeMethodOptions} from '../contract.types';
import {ProposalInput} from './contract';
import {encodeDescription} from './proposal-format';

export const mapTransferOptions = (formData: {
  description: string;
  targetAccountId: string;
  token: string;
  amount: string;
  link: string;
}): ChangeMethodOptions<{proposal: ProposalInput}> => ({
  args: {
    proposal: {
      description: encodeDescription({
        description: formData.description,
        link: formData.link,
        // TODO: ProposeTransfer or ProposeTransferFunds? What's the difference?
        variant: 'ProposeTransfer',
      }),
      kind: {
        Transfer: {
          token_id: formData.token,
          amount: nearApi.utils.format.parseNearAmount(formData.amount)!,
          receiver_id: formData.targetAccountId,
        },
      },
    },
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN,
  amount: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT), // attached deposit — bond 1e+23 0.1 NEAR,
});
