import {Action} from '~/shared/api/near';

export const mapMultiVoteOptions = (proposalId: number, action: Action) => ({
  args: {
    id: proposalId,
    action,
  },
});
