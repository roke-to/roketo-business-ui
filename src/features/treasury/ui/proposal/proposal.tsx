import React from 'react';

import {Control} from '~/features/treasury/ui/control';
import {Proposal as ProposalType} from '~/shared/api/astro';
import {Col} from '~/shared/ui/components/col';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Minus} from '~/shared/ui/icons/minus.svg';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';

export interface ProposalProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: ProposalType;
}

type AccountId = string;

type VoteState = 'Yes' | 'No' | 'Dismiss';

type Votes = Record<AccountId, VoteState>;

type VotesStatistic = {
  voteYes: number;
  voteNo: number;
  voteRemove: number;
  votes: Votes;
};

function getVotesStatistic(votes: ProposalType['votes']): VotesStatistic {
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

export const Proposal = ({proposal}: ProposalProps) => {
  const {proposer, description, createdAt, votes} = proposal;

  const {voteYes, voteNo} = getVotesStatistic(votes);

  return (
    <Portlet type='row' width='full' justify='between'>
      <Col>
        <Typography as='span' weight='bold'>
          {proposer}
        </Typography>
        <Typography as='span'>Description: {description}</Typography>
      </Col>
      <Col>
        <Typography as='span' weight='bold'>
          {createdAt}
        </Typography>
        <Row justify='start' gap={4}>
          <Control text={voteYes} icon={Plus} variant='positive' />
          <Control text={voteNo} icon={Minus} variant='negative' />
        </Row>
      </Col>
    </Portlet>
  );
};
