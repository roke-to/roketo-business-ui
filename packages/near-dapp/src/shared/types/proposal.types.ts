import {
  ProposalKindSwaggerDto as BaseProposalKindSwaggerDto,
  Proposal as ProposalType,
  VotePolicy,
} from '~/shared/api/astro';

interface ProposalKindSwaggerDto extends BaseProposalKindSwaggerDto {
  amount: string;
}

export interface ImprovedProposalType extends ProposalType {
  kind: ProposalKindSwaggerDto;
}

interface ImprovedVotePolicy extends VotePolicy {
  threshold: string[];
}

export const isVotePolicyWithThreshold = (votePolicy: any): votePolicy is ImprovedVotePolicy => {
  const keys = Object.keys(votePolicy);
  return Array.isArray(votePolicy[keys[0]].threshold);
};
