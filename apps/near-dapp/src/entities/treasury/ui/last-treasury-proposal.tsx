import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {$treasuryProposals} from '~/entities/treasury/model/treasury';

export const LastTreasuryProposal = () => {
  const [lastProposal] = useStore($treasuryProposals);

  if (!lastProposal) {
    return null;
  }

  return <Proposal proposal={lastProposal} />;
};
