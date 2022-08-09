import clsx from 'clsx';
import React from 'react';

import type {Employee} from '~/shared/types/employee';
import {Button} from '~/shared/ui/components/button';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './employee-list-item.module.css';
import {Status} from './status';

interface Props {
  employee: Employee;
}

export const EmployeeListItem: React.FC<Props> = ({employee}) => (
  <Row justify='between' align='center' className={clsx(styles.wrapper)}>
    <Status status={employee.status} type={employee.type} />
    <Typography className='w-1/5'>{employee.name}</Typography>
    <Typography className='w-1/5'>{employee.role}</Typography>
    <Typography className='w-1/5'>{employee.wallet}</Typography>
    <Typography className='w-1/5'>{employee.salary}</Typography>
    <Button>...</Button>
  </Row>
);
