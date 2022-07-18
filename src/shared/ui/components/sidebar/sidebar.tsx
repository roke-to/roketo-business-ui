import clsx from 'clsx';
import React from 'react';

import styles from './sidebar.module.css';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({isOpen = true, children, className, ...props}, ref) => (
    <nav
      ref={ref}
      className={clsx(styles.sidebar, {[styles.isOpen]: isOpen}, className)}
      {...props}
    >
      {children}
    </nav>
  ),
);
