import {VoteAction} from '~/shared/api/near/contracts/sputnik-dao';

import {mapMultiVoteOptions} from './map-multi-vote-options';

describe('Multi vote ', () => {
  test('return right options for success request', () => {
    const proposalId = 17;
    const action = VoteAction.VoteReject;

    expect(mapMultiVoteOptions(proposalId, action)).toMatchObject({
      methodName: 'act_proposal',
      args: {
        id: proposalId,
        action,
      },
      gas: '300000000000000',
      deposit: '0',
    });
  });
});
