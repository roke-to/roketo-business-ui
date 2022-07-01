import clsx from 'clsx';
import React from 'react';

import styles from './heading.module.css';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: any;
  children?: React.ReactNode;
  color?: string;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({children, className, ...props}, ref) => (
    <h1 {...props} ref={ref} className={clsx(styles.heading, className)}>
      {children}
    </h1>
  ),
);
