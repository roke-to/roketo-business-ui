import {jsonToBase64} from '@roketo/core/lib/base64';

import {mapWithdrawRoketoStreamOptions} from './map-withdraw-roketo-stream-options';

describe('mapCreateRoketoStreamOptions', () => {
  it('should return correct options wrap.tesetnet', () => {
    const options = mapWithdrawRoketoStreamOptions({
      description: 'test stream',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      link: 'link',
      streamIds: ['xxxx'],
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeRoketoStreamWithdraw',
          kind: {
            FunctionCall: {
              receiver_id: 'streaming-r-v2.dcversus.testnet',
              actions: [
                {
                  method_name: 'withdraw',
                  args: jsonToBase64({
                    stream_ids: ['xxxx'],
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
