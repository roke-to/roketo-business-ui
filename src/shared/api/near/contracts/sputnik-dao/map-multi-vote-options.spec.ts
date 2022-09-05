import {VoteAction} from '~/shared/api/near/contracts/sputnik-dao/contract';

import {mapMultiVoteOptions} from './map-multi-vote-options';

describe('Multi vote ', () => {
  test('return right options for success request', () => {
    const proposalId = 17;
    const action = VoteAction.VoteReject;

    expect(mapMultiVoteOptions(proposalId, action)).toMatchObject({
      args: {
        id: proposalId,
        action,
      },
      gas: {
        length: 2,
        negative: 0,
        red: null,
        words: [24035328, 4470348],
      },
    });
  });
});
