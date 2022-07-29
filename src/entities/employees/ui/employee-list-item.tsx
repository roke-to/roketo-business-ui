import React from 'react';

import {Status} from '~/entities/employees/ui/status';
import {Button} from '~/shared/ui/components/button';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import type {Employee} from '../model/types';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  employee: Employee;
};

export const EmployeeListItem: React.FC<Props> = ({employee}) => (
  <Row justify='between' align='center'>
    <Status status={employee.status} type={employee.type} />
    <Typography className='w-1/5'>{employee.name}</Typography>
    <Typography className='w-1/5'>{employee.role}</Typography>
    <Typography className='w-1/5'>{employee.wallet}</Typography>
    <Typography className='w-1/5'>{employee.salary}</Typography>
    <Button>blah</Button>
  </Row>
);
