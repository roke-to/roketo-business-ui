import {mapMultiVoteOptions} from './map-multi-vote-options';

describe('Multi vote ', () => {
  test('return right options for success request', () => {
    console.log(mapMultiVoteOptions('123', 'VoteReject'));
  });
});
