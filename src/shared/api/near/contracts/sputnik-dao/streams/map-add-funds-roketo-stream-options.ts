import * as nearApi from 'near-api-js';
import {BigNumber} from 'bignumber.js';

import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import {encodeDescription} from '~/shared/api/near/contracts/sputnik-dao/proposal-format';
import {jsonToBase64} from '~/shared/lib/base64';

export const mapAddFundsRoketoStreamOptions = (formData: {
  description: string;
  tokenAccountId: string;
  roketoContractName: string;
  amount: string;
  link: string;
  wNearId: string;
  streamId: string;
}) => {
  const isNearToken = formData.tokenAccountId === 'NEAR';

  const notNearTokens =
    formData.tokenAccountId !== 'NEAR' && formData.tokenAccountId !== formData.wNearId;

  const actions = [];

  if (isNearToken) {
    actions.push({
      method_name: 'near_deposit',
      args: jsonToBase64({}),
      gas: new BigNumber(30 * 10 ** 12).toString(),
      // minimal deposit is 0.1 NEAR
      deposit: new BigNumber(formData.amount).toFixed(0),
    });
  }

  return {
    methodName: 'add_proposal',
    args: {
      proposal: {
        description: encodeDescription({
          description: formData.description,
          link: formData.link,
          variant: 'ProposeAddFundsToRoketoStream',
        }),
        kind: {
          FunctionCall: {
            receiver_id: notNearTokens ? formData.tokenAccountId : formData.wNearId,
            actions: [
              ...actions,
              {
                method_name: 'ft_transfer_call',
                args: jsonToBase64({
                  receiver_id: formData.roketoContractName,
                  amount: new BigNumber(formData.amount).toFixed(0),
                  memo: 'Roketo transfer',
                  msg: JSON.stringify({
                    Deposit: {
                      stream_id: formData.streamId,
                    },
                  }),
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
  };
};
