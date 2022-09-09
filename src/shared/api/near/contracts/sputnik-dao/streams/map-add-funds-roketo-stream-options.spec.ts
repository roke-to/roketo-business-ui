import {jsonToBase64} from '~/shared/lib/base64';

import {mapAddFundsRoketoStreamOptions} from './map-add-funds-roketo-stream-options';

describe('mapCreateRoketoStreamOptions', () => {
  it('should return correct options wrap.tesetnet', () => {
    const options = mapAddFundsRoketoStreamOptions({
      description: 'test stream',
      tokenAccountId: 'wrap.testnet',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      amount: '110000000000000000000000',
      link: 'link',
      wNearId: 'wrap.testnet',
      streamId: 'xxxx',
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeAddFundsToRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'wrap.testnet',
              actions: [
                {
                  method_name: 'ft_transfer_call',
                  args: jsonToBase64({
                    receiver_id: 'streaming-r-v2.dcversus.testnet',
                    amount: '110000000000000000000000',
                    memo: 'Roketo transfer',
                    msg: JSON.stringify({
                      Deposit: {
                        stream_id: 'xxxx',
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
  it('should return correct options NEAR', () => {
    const options = mapAddFundsRoketoStreamOptions({
      description: 'test stream',
      tokenAccountId: 'NEAR',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      amount: '110000000000000000000000',
      link: 'link',
      wNearId: 'wrap.testnet',
      streamId: 'xxxx',
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeAddFundsToRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'wrap.testnet',
              actions: [
                {
                  method_name: 'near_deposit',
                  args: 'e30=',
                  deposit: '110000000000000000000000',
                  gas: '30000000000000',
                },
                {
                  method_name: 'ft_transfer_call',
                  args: jsonToBase64({
                    receiver_id: 'streaming-r-v2.dcversus.testnet',
                    amount: '110000000000000000000000',
                    memo: 'Roketo transfer',
                    msg: JSON.stringify({
                      Deposit: {
                        stream_id: 'xxxx',
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
  it('should return correct options dai-token', () => {
    const options = mapAddFundsRoketoStreamOptions({
      description: 'test stream',
      tokenAccountId: 'dai.fakes.testnet',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      amount: '110000000000000000000000',
      link: 'link',
      wNearId: 'wrap.testnet',
      streamId: 'xxxx',
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeAddFundsToRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'dai.fakes.testnet',
              actions: [
                {
                  method_name: 'ft_transfer_call',
                  args: jsonToBase64({
                    receiver_id: 'streaming-r-v2.dcversus.testnet',
                    amount: '110000000000000000000000',
                    memo: 'Roketo transfer',
                    msg: JSON.stringify({
                      Deposit: {
                        stream_id: 'xxxx',
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
