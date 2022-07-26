import React from 'react';

import type {Employee} from '../model/types';

type Props = {
  employee: Employee;
};

export const EmployeeCard: React.FC<Props> = ({employee}) => (
  <pre>{JSON.stringify(employee, null, 2)}</pre>
);
