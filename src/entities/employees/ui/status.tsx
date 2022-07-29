import clsx from 'clsx';
import React from 'react';

import {Employee} from '~/entities/employees';
import styles from '~/entities/employees/ui/status.module.css';

type Props = {
  status: Employee['status'];
  type: Employee['type'];
};

export const Status: React.FC<Props> = ({status, type}) => (
  <div className={clsx(styles.status, styles[status], styles[type])} />
);
