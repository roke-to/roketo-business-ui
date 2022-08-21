import {useStore} from 'effector-react';
import React from 'react';

import '~/app/initI18n';
import {$appLoading} from '~/entities/app';
import {$sideBarState, setSideBarState} from '~/entities/menu';
import {$isMobileScreen} from '~/entities/screens';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {DaoSwitcher} from '~/features/dao/ui/dao-switcher';
import {Notifications} from '~/features/notifications/ui';
import {Routing} from '~/pages';
import {ROUTES} from '~/shared/config/routes';
import {Navigate} from '~/shared/ui/components/navigate';
import {ReactComponent as NavigateIcon} from '~/shared/ui/icons/dashboard_ico.svg';
import '~/shared/ui/styles';
import {LayoutProvider} from '~/widgets/layout';

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

export function Root() {
  const isLoading = useStore($appLoading);
  const {isOpen: isSidebarOpen} = useStore($sideBarState);
  const accountId = useStore($accountId);
  const isMobile = useStore($isMobileScreen);
  const showSideBar = !isMobile || isSidebarOpen;

  const handleSidebarToggle = React.useCallback(
    () => setSideBarState({isOpen: !isSidebarOpen}),
    [isSidebarOpen],
  );

  // TODO: TBD кажется тут нужен спиннер ибо при ините есть белый экран заметный глазом
  if (isLoading) {
    return null;
  }

  return (
    <LayoutProvider
      isSidebarOpen={showSideBar}
      onSidebarToggle={handleSidebarToggle}
      navigation={
        <Navigate
          accountId={accountId}
          isMobile={isMobile}
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
      <Routing />
    </LayoutProvider>
  );
}
