import {Proposal} from '~/shared/api/astro';

export const isActiveVoteStatusProposal = (voteStatus: Proposal['voteStatus']) =>
  voteStatus !== 'Expired';
