import clsx from 'clsx';
import React, {PropsWithChildren} from 'react';

import type {ReactComponent as IconComponent} from '~/shared/ui/icons/dashboard_ico.svg';

import styles from './list-tem.module.css';

export interface ListItemProps {
  isSelected?: boolean;
  icon?: typeof IconComponent;
  className?: string;
}

export const ListItem = React.forwardRef<HTMLLIElement, PropsWithChildren<ListItemProps>>(
  ({isSelected, icon: Icon, className, children}, ref) => (
    <li ref={ref} className={clsx(styles.listItem, {[styles.active]: isSelected}, className)}>
      {Icon && <Icon className={styles.icon} />}
      {children}
    </li>
  ),
);

ListItem.displayName = 'ListItem';
