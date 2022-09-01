import * as nearApi from 'near-api-js';
import BN from 'bn.js';

import {
  ATTACHED_DEPOSIT,
  DATA_SEPARATOR,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';

import {ChangeMethodOptions} from '../contract.types';
import {ProposalInput} from './contract';

export const mapFunctionCallOptions = (formData: {
  description: string;
  contractAddress: string;
  contractMethod: string;
  json: string;
  deposit: string;
  externalUrl?: string;
}): ChangeMethodOptions<{proposal: ProposalInput}> => {
  const proposalDescription = `${formData.description}${DATA_SEPARATOR}${
    formData.externalUrl || ''
  }`;
  const args = Buffer.from(formData.json).toString('base64');

  return {
    args: {
      proposal: {
        description: proposalDescription,
        kind: {
          FunctionCall: {
            receiver_id: formData.contractAddress,
            actions: [
              {
                method_name: formData.contractMethod,
                deposit: nearApi.utils.format.parseNearAmount(formData.deposit)!,
                args,
                gas: new BN(150 * 10 ** 12).toString(), // 150 TGas
              },
            ],
          },
        },
      },
    },
    gas: DEFAULT_FUNCTION_CALL_GAS_BN,
    amount: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT), // attached deposit — bond 1e+23 0.1 NEAR,
  };
};
