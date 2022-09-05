import {useStore} from 'effector-react';
import React from 'react';

import {Proposal} from '~/entities/proposal';
import {$treasuryProposals} from '~/entities/treasury/model/treasury';

export const LastTreasuryProposal = () => {
  const [lastProposal] = useStore($treasuryProposals);

  return <Proposal proposal={lastProposal} />;
};
