import {jsonToBase64} from '~/shared/lib/base64';

import {mapStartRoketoStreamOptions} from './map-start-roketo-stream-options';

describe('mapCreateRoketoStreamOptions', () => {
  it('should return correct options wrap.tesetnet', () => {
    const options = mapStartRoketoStreamOptions({
      description: 'test stream',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      link: 'link',
      streamId: 'xxxx',
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeStartRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'streaming-r-v2.dcversus.testnet',
              actions: [
                {
                  method_name: 'start_stream',
                  args: jsonToBase64({
                    stream_id: 'xxxx',
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
