import clsx from 'clsx';
import React from 'react';

import type {EmployeeResponseDto} from '~/shared/api/rb';
import {Button} from 'ui/components/button';
import {Row} from 'ui/components/row';
import {Typography} from 'ui/components/typography';

import styles from './employee-list-item.module.css';
import {EmployeeStatus} from './employee-status';

interface Props {
  employee: EmployeeResponseDto;
}

export const EmployeeListItem: React.FC<Props> = ({employee}) => (
  <Row justify='between' align='center' className={clsx(styles.wrapper)}>
    <EmployeeStatus status={employee.status} type={employee.type} />
    <Typography className='w-1/5'>{employee.name}</Typography>
    <Typography className='w-1/5'>{employee.position}</Typography>
    <Typography className='w-1/5'>{employee.nearLogin}</Typography>
    <Typography className='w-1/5'>{employee.salary}</Typography>
    <Button>...</Button>
  </Row>
);
