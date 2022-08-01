import clsx from 'clsx';
import React from 'react';

import type {Employee} from '../model/types';
import styles from './status.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  status: Employee['status'];
  type: Employee['type'];
}

export const Status: React.FC<Props> = ({status, type}) => (
  <div className={clsx(styles.status, styles[status], styles[type])} />
);
