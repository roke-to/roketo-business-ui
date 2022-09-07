import {mapTransferOptions} from './map-transfer-options';

describe('mapTransferOptions', () => {
  it('should return correct options', () => {
    const options = mapTransferOptions({
      description: 'description',
      targetAccountId: 'target.near',
      token: 'near',
      tokenDecimals: 24,
      amount: '123',
      link: 'link',
    });

    expect(options).toMatchObject({
      args: {
        proposal: {
          description: 'description$$$$link',
          kind: {
            Transfer: {
              token_id: 'near',
              amount: '123000000000000000000000000',
              receiver_id: 'target.near',
            },
          },
        },
      },
      gas: {
        length: 2,
        negative: 0,
        red: null,
        words: [24035328, 4470348],
      },
      amount: '100000000000000000000000',
    });
  });
});
