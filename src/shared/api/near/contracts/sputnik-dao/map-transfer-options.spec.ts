import {mapTransferOptions} from './map-transfer-options';

describe('mapTransferOptions', () => {
  it('should return correct options', () => {
    const options = mapTransferOptions({
      description: 'description',
      targetAccountId: 'target.near',
      token: 'near',
      amount: '123',
    });

    expect(options).toMatchObject({
      args: {
        proposal: {
          description: 'description',
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
