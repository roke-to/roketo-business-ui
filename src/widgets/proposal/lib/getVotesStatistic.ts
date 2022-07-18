import {Proposal as ProposalType} from '~/shared/api/astro';

type AccountId = string;

type VoteState = 'Yes' | 'No' | 'Dismiss';

type Votes = Record<AccountId, VoteState>;

type VotesStatistic = {
  voteYes: number;
  voteNo: number;
  voteRemove: number;
  votes: Votes;
};

export function getVotesStatistic(votes: ProposalType['votes']): VotesStatistic {
  const result: VotesStatistic = {
    voteYes: 0,
    voteNo: 0,
    voteRemove: 0,
    votes: {},
  };
  const rawVotes = votes as unknown as Record<string, string>;

  Object.keys(rawVotes).forEach((key) => {
    const rawValue = rawVotes[key];

    let value: VoteState;

    switch (rawValue) {
      case 'Approve':
        result.voteYes += 1;
        value = 'Yes';
        break;
      case 'Reject':
        result.voteNo += 1;
        value = 'No';
        break;
      default:
        result.voteRemove += 1;
        value = 'Dismiss';
        break;
    }

    result.votes[key] = value;
  });

  return result;
}
