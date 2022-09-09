import {BigNumber} from 'bignumber.js';

import {jsonToBase64} from '~/shared/lib/base64';

import {mapCreateRoketoStreamOptions} from './map-create-roketo-stream-options';

describe('mapCreateRoketoStreamOptions', () => {
  it('should return correct options wrap.tesetnet', () => {
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
      wNearId: 'wrap.testnet',
      depositSum: new BigNumber(30 * 10 ** 12),
      depositAmount: '',
      storageDepositAccountIds: [],
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
  it('should return correct options NEAR', () => {
    const options = mapCreateRoketoStreamOptions({
      description: 'test stream',
      tokenAccountId: 'NEAR',
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
      wNearId: 'wrap.testnet',
      depositSum: new BigNumber(30 * 10 ** 12),
      depositAmount: '',
      storageDepositAccountIds: [],
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
                  method_name: 'near_deposit',
                  args: 'e30=',
                  deposit: '110000000030000000000000',
                  gas: '30000000000000',
                },
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
  it('should return correct options dai-token', () => {
    const options = mapCreateRoketoStreamOptions({
      description: 'test stream',
      tokenAccountId: 'dai.fakes.testnet',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      totalAmount: '110000000000000000000000',
      link: 'link',
      transferPayload: {
        balance: '1000000000000000000',
        description: '{"col":"#2E56E9"}',
        is_auto_start_enabled: true,
        is_locked: false,
        owner_id: 'barsik-test-dao.sputnikv2.testnet',
        receiver_id: 'rkate.testnet',
        tokens_per_sec: '16666666666666666',
      },
      wNearId: 'wrap.testnet',
      depositSum: new BigNumber(30 * 10 ** 12),
      depositAmount: '2500000000000000000000',
      storageDepositAccountIds: ['rkate.testnet'],
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeCreateRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'dai.fakes.testnet',
              actions: [
                {
                  method_name: 'storage_deposit',
                  args: jsonToBase64({
                    account_id: 'rkate.testnet',
                    registration_only: true,
                  }),
                  deposit: '2500000000000000000000',
                  gas: '30000000000000',
                },
                {
                  method_name: 'ft_transfer_call',
                  args: jsonToBase64({
                    receiver_id: 'streaming-r-v2.dcversus.testnet',
                    amount: '110000000000000000000000',
                    memo: '',
                    msg: JSON.stringify({
                      Create: {
                        request: {
                          balance: '1000000000000000000',
                          description: '{"col":"#2E56E9"}',
                          is_auto_start_enabled: true,
                          is_locked: false,
                          owner_id: 'barsik-test-dao.sputnikv2.testnet',
                          receiver_id: 'rkate.testnet',
                          tokens_per_sec: '16666666666666666',
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
