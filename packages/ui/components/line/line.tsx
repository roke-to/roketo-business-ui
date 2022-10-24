import clsx from 'clsx';
import React from 'react';

import styles from './line.module.css';

export interface LineProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}
export const Line = ({className}: LineProps) => <div className={clsx(styles.root, className)} />;
