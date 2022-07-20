import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState} from '~/entities/menu';
import {useMediaQuery} from '~/shared/hook/useMatchQuery';
import {Layout} from '~/shared/ui/components/layout';
import {Sidebar} from '~/shared/ui/components/sidebar';
import {Header} from '~/widgets/header';
import {Navigate} from '~/widgets/navigate';

export interface IPageLayoutProps {}

export const PageLayout: React.FC<IPageLayoutProps> = ({children}) => {
  const sideBarState = useStore($sideBarState);

  const isMobileWidth = useMediaQuery('(max-width: 640px)');
  const showSideBar = !isMobileWidth || sideBarState.isOpen;
  const mainLayoutSideBarMargin = showSideBar ? 'sidebar' : undefined;

  return (
    <Layout type='row' withBackground={false}>
      <Sidebar isOpen={showSideBar}>
        <Navigate />
      </Sidebar>
      <Layout
        as='main'
        gap={3}
        withContent
        withBackground={false}
        marginLeft={mainLayoutSideBarMargin}
      >
        <Header />
        {children}
      </Layout>
    </Layout>
  );
};
