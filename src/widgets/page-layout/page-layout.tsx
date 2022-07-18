import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState} from '~/entities/menu';
import {Layout} from '~/shared/ui/components/layout';
import {Sidebar} from '~/shared/ui/components/sidebar';
import {Header} from '~/widgets/header';
import {Navigate} from '~/widgets/navigate';

export interface IPageLayoutProps {}

export const PageLayout: React.FC<IPageLayoutProps> = ({children}) => {
  const sideBarState = useStore($sideBarState);

  return (
    <Layout type='row' withBackground={false}>
      <Sidebar isOpen={sideBarState.isOpen}>
        <Navigate />
      </Sidebar>
      <Layout as='main' gap={3} withContent withBackground={false}>
        <Header />
        {children}
      </Layout>
    </Layout>
  );
};
