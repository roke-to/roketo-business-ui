import clsx from 'clsx';
import React from 'react';

import {IconButton} from 'ui/components/icon-button';
import {ReactComponent as LogoIcon} from 'ui/icons/logo.svg';
import {ReactComponent as MenuIcon} from 'ui/icons/menu.svg';

import {ILayoutTypeProps} from './base';
import styles from './main.module.css';

export const MainLayout: React.FC<ILayoutTypeProps> = ({
  children,
  sidebarContent,
  mainHeaderContent,
  isSidebarOpen,
  onSidebarToggle,
}) => (
  <div className={clsx(styles.root, {[styles.isSidebarOpen]: isSidebarOpen})}>
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <LogoIcon />
      </div>
      <div className={styles.sidebarContent}>{sidebarContent}</div>
    </aside>
    <main className={styles.main}>
      <div className={styles.header}>
        <IconButton
          variant='clean'
          size='sm'
          className={styles.burgerMenu}
          onClick={onSidebarToggle}
        >
          <MenuIcon />
        </IconButton>
        {mainHeaderContent}
      </div>
      <div className={styles.content}>{children}</div>
    </main>
  </div>
);

MainLayout.displayName = 'MainLayout';
