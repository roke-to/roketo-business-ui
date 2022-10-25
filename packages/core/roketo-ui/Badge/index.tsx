import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.scss';

type BadgeProps = {
  isOrange?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Badge({isOrange, children, className}: BadgeProps) {
  return (
    <span className={clsx(styles.badge, isOrange ? styles.orange : styles.blue, className)}>
      {children}
    </span>
  );
}
