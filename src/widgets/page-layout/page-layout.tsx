import React from 'react';

import {Layout} from '~/shared/ui/components/layout';
import {Sidebar} from '~/shared/ui/components/sidebar';
import {Header} from '~/widgets/header';
import {Navigate} from '~/widgets/navigate';

export interface IPageLayoutProps {}

export const PageLayout: React.FC<IPageLayoutProps> = ({children}) => (
  <Layout type='row' withBackground={false}>
    <Sidebar>
      <Navigate />
    </Sidebar>
    <Layout as='main' gap={3} withContent withBackground={false}>
      <Header />
      {children}
    </Layout>
  </Layout>
);
