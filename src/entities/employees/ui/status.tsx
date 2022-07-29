import clsx from 'clsx';
import React from 'react';

import styles from '~/entities/employees/ui/status.module.css';

import type {Employee} from '../model/types';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  status: Employee['status'];
  type: Employee['type'];
};

export const Status: React.FC<Props> = ({status, type}) => (
  <div className={clsx(styles.status, styles[status], styles[type])} />
);
