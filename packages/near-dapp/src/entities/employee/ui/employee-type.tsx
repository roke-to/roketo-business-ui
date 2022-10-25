import clsx from 'clsx';
import React from 'react';

import {EmployeeResponseDto} from '~/shared/api/rb';

import {Typography} from '@roketo/core/ui/components/typography';

import styles from './employee-type.module.css';

type Props = Pick<EmployeeResponseDto, 'type' | 'status'>;

export const EmployeeType: React.FC<Props> = ({type, status}) => (
  <Typography className={clsx(styles[status], 'px-2 rounded-xl')}>{type}</Typography>
);
