import {jsonToBase64} from '~/shared/lib/base64';

import {mapStopRoketoStreamOptions} from './map-stop-roketo-stream-options';

describe('mapCreateRoketoStreamOptions', () => {
  it('should return correct options wrap.tesetnet', () => {
    const options = mapStopRoketoStreamOptions({
      description: 'test stream',
      roketoContractName: 'streaming-r-v2.dcversus.testnet',
      link: 'link',
      streamId: 'xxxx',
    });

    expect(options).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'test stream$$$$link$$$$ProposeStopRoketoStream',
          kind: {
            FunctionCall: {
              receiver_id: 'streaming-r-v2.dcversus.testnet',
              actions: [
                {
                  method_name: 'stop_stream',
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
