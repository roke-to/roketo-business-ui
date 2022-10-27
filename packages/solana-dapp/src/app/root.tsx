import {useStore} from 'effector-react';
import React from 'react';

import '~/app/initI18n';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {DaoSwitcher} from '~/features/dao/ui/dao-switcher';
import {Notifications} from '~/features/notifications/ui';
import {Routing} from '~/pages';
import {ROUTES} from '~/shared/config/routes';

import {$isMobileScreen} from '@roketo/core/effects/screens';
import {LayoutProvider} from '@roketo/core/ui/components/layout';
import {Navigate} from '@roketo/core/ui/components/navigate';
import {ReactComponent as DashboardIcon} from '@roketo/core/ui/icons/nav/dashboard.svg';
import {ReactComponent as EmployeeIcon} from '@roketo/core/ui/icons/nav/employee.svg';
import {ReactComponent as NftIcon} from '@roketo/core/ui/icons/nav/nft.svg';
import {ReactComponent as SettingsIcon} from '@roketo/core/ui/icons/nav/settings.svg';
import {ReactComponent as StreamIcon} from '@roketo/core/ui/icons/nav/stream.svg';
import {ReactComponent as TreasuryIcon} from '@roketo/core/ui/icons/nav/treasury.svg';
import '@roketo/core/ui/styles';

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
  {
    icon: NftIcon,
    title: 'NFT',
    path: ROUTES.nft.path,
  },
];

export function Root() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const accountId = useStore($accountId);
  const isMobile = useStore($isMobileScreen);
  const showSideBar = !isMobile || isSidebarOpen;

  const handleSidebarToggle = React.useCallback(
    () => setSidebarOpen((prevSidebarOpen) => !prevSidebarOpen),
    [],
  );

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
