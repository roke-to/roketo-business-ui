import {useStore} from 'effector-react';
import React from 'react';

import {$treasuryProposals, loadTreasuryProposals} from '~/entities/treasury';

export const ProposalsList = () => {
  const treasuryProposals = useStore($treasuryProposals);

  React.useEffect(() => {
    loadTreasuryProposals();
  }, []);

  return <pre>{JSON.stringify(treasuryProposals, null, 2)}</pre>;
};
