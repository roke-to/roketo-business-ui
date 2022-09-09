import React from 'react';

import {Employees} from '~/entities/employees';
import {env} from '~/shared/config/env';
import {Layout} from '~/shared/ui/components/layout';
import {PageStub} from '~/shared/ui/components/page-stub';

export const EmployeesPage = () => (
  <Layout>
    {env.PROD ? (
      <PageStub
        primaryText='Early acces to new features'
        secondaryText='Set up salaries and recurring payments to your employees and contributors'
      />
    ) : (
      <Employees />
    )}
  </Layout>
);
