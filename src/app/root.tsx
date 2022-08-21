import {useStore} from 'effector-react';
import React from 'react';

import '~/app/initI18n';
import {$appLoading} from '~/entities/app';
import {$isMobileScreen} from '~/entities/screens';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {DaoSwitcher} from '~/features/dao/ui/dao-switcher';
import {Notifications} from '~/features/notifications/ui';
import {Routing} from '~/pages';
import {ROUTES} from '~/shared/config/routes';
import {LayoutProvider} from '~/shared/ui/components/layout';
import {Navigate} from '~/shared/ui/components/navigate';
import {ReactComponent as DashboardIcon} from '~/shared/ui/icons/nav/dashboard.svg';
import {ReactComponent as EmployeeIcon} from '~/shared/ui/icons/nav/employee.svg';
import {ReactComponent as SettingsIcon} from '~/shared/ui/icons/nav/settings.svg';
import {ReactComponent as StreamIcon} from '~/shared/ui/icons/nav/stream.svg';
import {ReactComponent as TreasuryIcon} from '~/shared/ui/icons/nav/treasury.svg';
import '~/shared/ui/styles';

const navItems = [
  {
    icon: DashboardIcon,
    title: 'Dashboard',
    path: ROUTES.dashboard.path,
  },
  {
    icon: TreasuryIcon,
    title: 'Treasury',
    path: ROUTES.treasury.path,
  },
  {
    icon: SettingsIcon,
    title: 'Governance',
    path: ROUTES.governance.path,
  },
  {
    icon: EmployeeIcon,
    title: 'Employees',
    path: ROUTES.employees.path,
  },
  {
    icon: StreamIcon,
    title: 'Streams',
    path: ROUTES.streams.path,
  },
];

export function Root() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const isLoading = useStore($appLoading);
  const accountId = useStore($accountId);
  const isMobile = useStore($isMobileScreen);
  const showSideBar = !isMobile || isSidebarOpen;

  const handleSidebarToggle = React.useCallback(
    () => setSidebarOpen((prevSidebarOpen) => !prevSidebarOpen),
    [],
  );

  // TODO: TBD кажется тут нужен спиннер ибо при ините есть белый экран заметный глазом
  if (isLoading) {
    return null;
  }

  return (
    <LayoutProvider
      isSidebarOpen={showSideBar}
      onSidebarToggle={handleSidebarToggle}
      sidebarContent={
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
