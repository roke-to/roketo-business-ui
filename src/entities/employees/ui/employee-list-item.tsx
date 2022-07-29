import React from 'react';

import {Row} from '~/shared/ui/components/row';

import type {Employee} from '../model/types';

type Props = {
  employee: Employee;
};

export const EmployeeListItem: React.FC<Props> = ({employee}) => (
  <Row>
    <pre>{employee.name}</pre>
  </Row>
);
