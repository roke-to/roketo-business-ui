import React from 'react';

import {Treasury} from '~/features/treasury/ui/treasury';
import {PageLayout} from '~/widgets/page-layout';

export const DashboardPage = () => (
  <PageLayout>
    <Treasury />
  </PageLayout>
);
