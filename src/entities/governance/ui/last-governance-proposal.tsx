import {useStore} from 'effector-react';
import React from 'react';

import {$governanceProposals} from '~/entities/governance/model';
import {Proposal} from '~/entities/proposal';

export const LastGovernanceProposal = () => {
  const [lastProposal] = useStore($governanceProposals);

  if (!lastProposal) {
    return null;
  }

  return <Proposal proposal={lastProposal} />;
};
