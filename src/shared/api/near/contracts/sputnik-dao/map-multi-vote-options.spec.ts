import {mapMultiVoteOptions} from './map-multi-vote-options';

describe('Multi vote ', () => {
  test('return right options for success request', () => {
    const proposalId = 17;
    const action = 'VoteReject';

    expect(mapMultiVoteOptions(proposalId, action)).toEqual({
      args: {
        id: proposalId,
        action,
      },
      gas: {
        length: 2,
        negative: 0,
        red: null,
        words: [56090624, 447034],
      },
      amount: '100000000000000000000000',
    });
  });
});
