import {jsonToBase64} from '~/shared/lib/base64';

import {mapCreateRoketoStreamOptions} from './map-create-roketo-stream-options';

describe('mapCreateRoketoStreamOptions', () => {
  it('should return correct options', () => {
    const options = mapCreateRoketoStreamOptions({
      description: 'test stream',
      tokenAccountId: 'wrap.testnet',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      totalAmount: '110000000000000000000000',
      link: 'link',
      transferPayload: {
        balance: '100000000000000',
        description: '',
        owner_id: 'testchangepolicy.sputnikv2.testnet',
        receiver_id: 'barsik.testnet',
        tokens_per_sec: '2777777777777777777.8',
        is_auto_start_enabled: true,
        is_expirable: true,
      },
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeCreateRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'wrap.testnet',
              actions: [
                {
                  method_name: 'ft_transfer_call',
                  args: jsonToBase64({
                    receiver_id: 'streaming-r-v2.dcversus.testnet',
                    amount: '110000000000000000000000',
                    memo: '',
                    msg: JSON.stringify({
                      Create: {
                        request: {
                          balance: '100000000000000',
                          description: '',
                          owner_id: 'testchangepolicy.sputnikv2.testnet',
                          receiver_id: 'barsik.testnet',
                          tokens_per_sec: '2777777777777777777.8',
                          is_auto_start_enabled: true,
                          is_expirable: true,
                        },
                      },
                    }),
                  }),
                  deposit: '1',
                  gas: '100000000000000',
                },
              ],
            },
          },
        },
      },
      gas: '300000000000000',
      deposit: '100000000000000000000000',
    });
  });
});
