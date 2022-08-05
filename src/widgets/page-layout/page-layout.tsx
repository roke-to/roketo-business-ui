import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState} from '~/entities/menu';
import {sendTransactions} from '~/entities/proposal/model/proposal';
import {theme} from '~/shared/config/theme';
import {useMediaQuery} from '~/shared/hook/useMediaQuery';
import {Layout} from '~/shared/ui/components/layout';
import {Header} from '~/widgets/header';
import {Navigate} from '~/widgets/navigate';

import styles from './page-layout.module.css';

export interface IPageLayoutProps {}

export const PageLayout: React.FC<IPageLayoutProps> = ({children}) => {
  const sideBarState = useStore($sideBarState);

  const isMobileWidth = useMediaQuery(`(max-width: ${theme.screens.tablet})`);
  const showSideBar = !isMobileWidth || sideBarState.isOpen;

  sendTransactions();

  return (
    <Layout type='row' withBackground={false}>
      <nav className={clsx(styles.sidebar, {[styles.isOpen]: showSideBar})}>
        <Navigate isMobileWidth={isMobileWidth} />
      </nav>
      <Layout
        as='main'
        gap={3}
        withContent
        withBackground={false}
        className={clsx({[styles.main]: showSideBar})}
      >
        <Header />
        <div className={styles.content}>{children}</div>
      </Layout>
    </Layout>
  );
};
