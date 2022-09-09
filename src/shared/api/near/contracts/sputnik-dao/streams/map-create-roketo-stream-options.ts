import * as nearApi from 'near-api-js';
import {BigNumber} from 'bignumber.js';

import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import {encodeDescription} from '~/shared/api/near/contracts/sputnik-dao/proposal-format';
import {jsonToBase64} from '~/shared/lib/base64';

export const mapCreateRoketoStreamOptions = (formData: {
  description: string;
  tokenAccountId: string;
  roketoContractName: string;
  totalAmount: string;
  link: string;
  transferPayload: {
    description?: string;
    owner_id: string;
    receiver_id: string;
    balance: string;
    tokens_per_sec: string;
    cliff_period_sec?: number;
    is_auto_start_enabled?: boolean;
    is_expirable?: boolean;
    is_locked?: boolean;
  };
  wNearId: string;
  depositSum: BigNumber;
  depositAmount: string;
  storageDepositAccountIds: string[];
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
      deposit: new BigNumber(formData.totalAmount).plus(formData.depositSum).toFixed(0),
    });
  }

  if (notNearTokens) {
    formData.storageDepositAccountIds.forEach((accountIdForStorageDep) => {
      actions.push({
        method_name: 'storage_deposit',
        args: jsonToBase64({
          account_id: accountIdForStorageDep,
          registration_only: true,
        }),
        gas: new BigNumber(30 * 10 ** 12).toString(),
        // minimal deposit is 0.1 NEAR
        deposit: formData.depositAmount,
      });
    });
  }

  return {
    methodName: 'add_proposal',
    args: {
      proposal: {
        description: encodeDescription({
          description: formData.description,
          link: formData.link,
          variant: 'ProposeCreateRoketoStream',
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
                  amount: new BigNumber(formData.totalAmount).toFixed(0),
                  memo: '',
                  msg: JSON.stringify({
                    Create: {
                      request: formData.transferPayload,
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
