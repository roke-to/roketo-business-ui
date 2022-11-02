import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import '~/app/initI18n';
import {$appLoading, $appState} from '~/entities/app';
import {$isMobileScreen} from '~/entities/screens';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {DaoSwitcher} from '~/features/dao/ui/dao-switcher';
import {Notifications} from '~/features/notifications/ui';
import {Routing} from '~/pages';
import {NetworkId} from '~/shared/api/near/options';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';

import {Layout, LayoutProvider} from '@roketo/core/ui/components/layout';
import {Navigate} from '@roketo/core/ui/components/navigate';
import {PageStub} from '@roketo/core/ui/components/page-stub';
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

const dAppHref: Record<NetworkId, string> = {
  mainnet: env.RB_UI_MAINNET,
  testnet: env.RB_UI_TESTNET,
};

export function Root() {
  const {t} = useTranslation('stub');
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const isLoading = useStore($appLoading);
  const appState = useStore($appState);
  const accountId = useStore($accountId);
  const isMobile = useStore($isMobileScreen);
  const showSideBar = !isMobile || isSidebarOpen;

  const handleSidebarToggle = React.useCallback(
    () => setSidebarOpen((prevSidebarOpen) => !prevSidebarOpen),
    [],
  );

  let mainContent;

  if (appState === 'crashed') {
    const networkId = env.NEAR_NETWORK_ID === 'testnet' ? 'mainnet' : 'testnet';
    mainContent = (
      <Layout type='intro'>
        <PageStub
          primaryText={t('nearCrashed.primaryText')}
          secondaryText={t('nearCrashed.secondaryText')}
          href={dAppHref[networkId]}
          buttonText={t('nearCrashed.goTo', {networkId})}
          className='w-[600px] tablet:w-full bg-white'
        />
      </Layout>
    );
  }
  // TODO: TBD кажется тут нужен спиннер ибо при ините есть белый экран заметный глазом
  else if (isLoading) {
    mainContent = <Layout type='intro'>Loading...</Layout>;
  } else {
    mainContent = <Routing />;
  }

  return (
    <LayoutProvider
      trackingId={env.TRACKING_ID}
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
      {mainContent}
    </LayoutProvider>
  );
}
