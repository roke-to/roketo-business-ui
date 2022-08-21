import clsx from 'clsx';
import React from 'react';

import {IconButton} from '~/shared/ui/components/icon-button';
import {ReactComponent as Menu} from '~/shared/ui/icons/menu.svg';

import {ILayoutTypeProps} from './base';
import styles from './main.module.css';

export const MainLayout: React.FC<ILayoutTypeProps> = ({
  children,
  navigation,
  mainHeaderContent,
  isSidebarOpen,
  onSidebarToggle,
}) => (
  <div className={styles.root}>
    <aside className={clsx(styles.sidebar, {[styles.isOpen]: isSidebarOpen})}>
      <div className={styles.logo}>RB</div>
      {navigation}
    </aside>
    <main className={clsx(styles.main, {[styles.isSidebarOpen]: isSidebarOpen})}>
      <div className={styles.header}>
        <IconButton
          variant='clean'
          size='sm'
          className={styles.burgerMenu}
          onClick={onSidebarToggle}
        >
          <Menu />
        </IconButton>
        {mainHeaderContent}
      </div>
      <div className={styles.content}>{children}</div>
    </main>
  </div>
);

MainLayout.displayName = 'MainLayout';
