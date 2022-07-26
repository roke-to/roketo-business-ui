import React from 'react';

import {GovernanceProposalsFilters} from '~/features/governance/ui/proposals-filters';
import {ProposalsList} from '~/features/governance/ui/proposals-list';
import {Councils} from '~/widgets/councils';
import {PageLayout} from '~/widgets/page-layout';

export const GovernancePage = () => (
  <PageLayout>
    <Councils />
    <GovernanceProposalsFilters />
    <ProposalsList />
  </PageLayout>
);
