import * as nearApi from 'near-api-js';
import Decimal from 'decimal.js';

import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';

import {encodeDescription} from './proposal-format';

export const mapTransferOptions = (formData: {
  description: string;
  targetAccountId: string;
  token: string;
  tokenDecimals: number;
  amount: string;
  link: string;
}) => ({
  methodName: 'add_proposal',
  args: {
    proposal: {
      // variant no needed, because transfer is unambiguous by itself
      description: encodeDescription({
        description: formData.description,
        link: formData.link,
      }),
      kind: {
        Transfer: {
          token_id: formData.token,
          amount: new Decimal(formData.amount).mul(10 ** formData.tokenDecimals).toFixed(),
          receiver_id: formData.targetAccountId,
        },
      },
    },
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
  deposit: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT)!, // attached deposit — bond 1e+23 0.1 NEAR,
});
