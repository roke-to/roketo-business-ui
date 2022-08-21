import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState, setSideBarState} from '~/entities/menu';
import {$isMobileScreen} from '~/entities/screens';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {DaoSwitcher} from '~/features/dao/ui/dao-switcher';
import {Notifications} from '~/features/notifications/ui';
import {ROUTES} from '~/shared/config/routes';
import {Navigate} from '~/shared/ui/components/navigate';
import {ReactComponent as NavigateIcon} from '~/shared/ui/icons/dashboard_ico.svg';

import {IntroLayout, MainLayout} from './type';

const layoutTypes = {
  intro: IntroLayout,
  main: MainLayout,
};

export type LayoutType = keyof typeof layoutTypes;

export interface ILayoutProps {
  type?: LayoutType;
}

const navItems = [
  {
    icon: NavigateIcon,
    title: 'Dashboard',
    path: ROUTES.dashboard.path,
  },
  {
    icon: NavigateIcon,
    title: 'Treasury',
    path: ROUTES.treasury.path,
  },
  {
    icon: NavigateIcon,
    title: 'Governance',
    path: ROUTES.governance.path,
  },
  {
    icon: NavigateIcon,
    title: 'Employees',
    path: ROUTES.employees.path,
  },
  {
    icon: NavigateIcon,
    title: 'Streams',
    path: ROUTES.streams.path,
  },
];

export const PageLayout: React.FC<ILayoutProps> = ({children, type = 'main'}) => {
  const {isOpen: isSidebarOpen} = useStore($sideBarState);
  const accountId = useStore($accountId);
  const isMobile = useStore($isMobileScreen);
  const showSideBar = !isMobile || isSidebarOpen;

  const handleSidebarToggle = React.useCallback(
    () => setSideBarState({isOpen: !isSidebarOpen}),
    [isSidebarOpen],
  );

  const LayoutComponent = layoutTypes[type];

  return (
    <LayoutComponent
      isSidebarOpen={showSideBar}
      onSidebarToggle={handleSidebarToggle}
      navigation={
        <Navigate
          accountId={accountId}
          isMobileWidth={isMobile}
          onLogout={logoutClicked}
          navItems={navItems}
        />
      }
      mainHeaderContent={
        <>
          <DaoSwitcher className='px-0' />
          <Notifications />
        </>
      }
    >
      {children}
    </LayoutComponent>
  );
};
