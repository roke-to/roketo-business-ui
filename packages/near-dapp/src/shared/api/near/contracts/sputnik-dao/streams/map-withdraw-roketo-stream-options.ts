import * as nearApi from 'near-api-js';
import {BigNumber} from 'bignumber.js';

import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import {encodeDescription} from '~/shared/api/near/contracts/sputnik-dao/proposal-format';
import {jsonToBase64} from '~/shared/lib/base64';

export const mapWithdrawRoketoStreamOptions = (formData: {
  description: string;
  link: string;
  streamIds: string[];
  roketoContractName: string;
}) => ({
  methodName: 'add_proposal',
  args: {
    proposal: {
      description: encodeDescription({
        description: formData.description,
        link: formData.link,
        variant: 'ProposeRoketoStreamWithdraw',
      }),
      kind: {
        FunctionCall: {
          receiver_id: formData.roketoContractName,
          actions: [
            {
              method_name: 'withdraw',
              args: jsonToBase64({
                stream_ids: formData.streamIds,
              }),
              gas: new BigNumber(100 * 10 ** 12).toString(), // 100 TGas,
              deposit: '1',
            },
          ],
        },
      },
    },
  },
  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
  deposit: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT)!, // attached deposit — bond 1e+23 0.1 NEAR,
});
