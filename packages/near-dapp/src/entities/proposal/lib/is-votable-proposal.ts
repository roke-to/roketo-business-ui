import {Proposal} from '~/shared/api/astro';

export const isVotableProposal = ({voteStatus, status}: Proposal) =>
  voteStatus === 'Active' && status === 'InProgress';
