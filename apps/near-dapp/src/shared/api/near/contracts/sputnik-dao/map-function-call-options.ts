import * as nearApi from 'near-api-js';
import BN from 'bn.js';

import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';

import {FunctionCallAction} from '@near-wallet-selector/core/lib/wallet/transactions.types';
import {encodeBase64} from '@roketo/core/lib/base64';

import {encodeDescription} from './proposal-format';

export const mapFunctionCallOptions = (formData: {
  description: string;
  contractAddress: string;
  contractMethod: string;
  json: string;
  deposit: string;
  link: string;
}): FunctionCallAction['params'] => ({
  methodName: 'add_proposal',
  args: {
    proposal: {
      description: encodeDescription({
        description: formData.description,
        link: formData.link,
        variant: 'ProposeCustomFunctionCall',
      }),
      kind: {
        FunctionCall: {
          receiver_id: formData.contractAddress,
          actions: [
            {
              method_name: formData.contractMethod,
              deposit: nearApi.utils.format.parseNearAmount(formData.deposit)!,
              args: encodeBase64(formData.json),
              gas: new BN(150 * 10 ** 12).toString(), // 150 TGas
            },
          ],
        },
      },
    },
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
  deposit: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT)!, // attached deposit — bond 1e+23 0.1 NEAR,
});
