import React from 'react';

import {ProposalsList} from '~/features/governance/ui/proposals-list';
import {Councils} from '~/widgets/councils';
import {PageLayout} from '~/widgets/page-layout';

export const GovernancePage = () => (
  <PageLayout>
    <Councils />
    <ProposalsList />
  </PageLayout>
);
