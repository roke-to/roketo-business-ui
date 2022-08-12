import clsx from 'clsx';
import React from 'react';

import styles from './alert.module.css';

export type AlertVariant = 'info' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLElement> {
  as?: any;
  className?: string;
  variant?: AlertVariant;
}

const DEFAULT_TAG = 'div';

export const Alert = React.forwardRef<HTMLElement, AlertProps>(
  ({as: Tag = DEFAULT_TAG, children, className, variant = 'info', ...props}, ref) => (
    <Tag {...props} ref={ref} className={clsx(styles.root, styles[variant], className)}>
      {children}
    </Tag>
  ),
);

Alert.displayName = 'Alert';
