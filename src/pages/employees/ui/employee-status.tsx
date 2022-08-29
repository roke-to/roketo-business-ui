import clsx from 'clsx';
import React from 'react';

import type {Employee} from '~/shared/types/employee';

import styles from './employee-status.module.css';

interface Props {
  status: Employee['status'];
  type: Employee['type'];
}

export const EmployeeStatus: React.FC<Props> = ({status, type}) => (
  <div className={clsx(styles.root, styles[status], styles[type])} />
);
