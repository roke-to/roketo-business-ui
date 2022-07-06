import clsx from 'clsx';
import React from 'react';

import styles from './sidebar.module.css';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({children, className, ...props}, ref) => (
    <nav ref={ref} className={clsx(styles.sidebar, className, 'mobile:flex')} {...props}>
      {children}
    </nav>
  ),
);
