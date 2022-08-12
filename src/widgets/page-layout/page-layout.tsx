import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState} from '~/entities/menu';
import {theme} from '~/shared/config/theme';
import {useMediaQuery} from '~/shared/hooks/useMediaQuery';
import {Layout} from '~/shared/ui/components/layout';
import {Header} from '~/widgets/header';
import {Navigate} from '~/widgets/navigate';

import styles from './page-layout.module.css';

export interface IPageLayoutProps {}

export const PageLayout: React.FC<IPageLayoutProps> = ({children}) => {
  const sideBarState = useStore($sideBarState);

  const isMobileWidth = useMediaQuery(`(max-width: ${theme.screens.tablet.max})`);
  const showSideBar = !isMobileWidth || sideBarState.isOpen;

  return (
    <Layout type='row' withBackground={false}>
      <div className={clsx(styles.sidebar, {[styles.isOpen]: showSideBar})}>
        <div className={styles.logo}>RB</div>
        <Navigate isMobileWidth={isMobileWidth} />
      </div>
      <Layout
        as='main'
        gap='2xl'
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
