import React from 'react';

import {ProposalsList} from '~/features/governance/ui/proposals-list';
import {PageLayout} from '~/widgets/page-layout';

export const GovernancePage = () => (
  <PageLayout>
    <ProposalsList />
  </PageLayout>
);
