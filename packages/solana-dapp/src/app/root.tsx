import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import '~/app/initI18n';
import {$accountId} from "~/entities/wallet";
import {$isMobileScreen} from "~/entities/screens";
import {$appLoading, $appState} from "~/entities/app";
import {Layout} from "ui/components/layout";
import 'ui/styles';

export function Root() {
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

  // TODO: TBD кажется тут нужен спиннер ибо при ините есть белый экран заметный глазом
  if (isLoading) {
    return <Layout type='intro'>Loading...</Layout>;
  }

  return (
    <div>
      Solana
    </div>
  )
}
