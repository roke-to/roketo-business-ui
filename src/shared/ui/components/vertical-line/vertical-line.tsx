import clsx from 'clsx';
import React from 'react';

import styles from './vertical-line.module.css';

export interface VerticalLineProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}
export const VerticalLine = ({className}: VerticalLineProps) => (
  <div className={clsx(styles.root, className)} />
);
