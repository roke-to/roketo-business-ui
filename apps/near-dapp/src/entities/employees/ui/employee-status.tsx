import clsx from 'clsx';
import React from 'react';

import {EmployeeResponseDto} from '~/shared/api/rb';

import styles from './employee-status.module.css';

interface Props {
  status: EmployeeResponseDto['status'];
  type: EmployeeResponseDto['type'];
}

export const EmployeeStatus: React.FC<Props> = ({status, type}) => (
  <div className={clsx(styles.root, styles[status], styles[type])} />
);
