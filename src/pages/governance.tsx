import React from 'react';

import {Councils} from '~/entities/councils';
import {GovernanceProposalsFilters} from '~/features/governance/ui/proposals-filters';
import {ProposalsList} from '~/features/governance/ui/proposals-list';
import {PageLayout} from '~/widgets/page-layout';

export const GovernancePage = () => (
  <PageLayout>
    <Councils />
    <GovernanceProposalsFilters />
    <ProposalsList />
  </PageLayout>
);
