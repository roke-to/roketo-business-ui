import {useStore} from 'effector-react';
import React from 'react';

import * as employeeModel from '../model/employee-model';

export const Employee: React.FC = () => {
  const employee = useStore(employeeModel.$employee);
  return <pre>{JSON.stringify({employee}, null, 2)}</pre>;
};
