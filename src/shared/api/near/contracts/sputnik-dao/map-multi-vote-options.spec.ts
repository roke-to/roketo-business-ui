import {Action} from '~/shared/api/near';

import {mapMultiVoteOptions} from './map-multi-vote-options';

describe('Multi vote ', () => {
  test('return right options for success request', () => {
    const proposalId = 17;
    const action = Action.VoteReject;

    expect(mapMultiVoteOptions(proposalId, action)).toEqual({
      args: {
        id: proposalId,
        action,
      },
    });
  });
});
