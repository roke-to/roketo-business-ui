import {useStore} from 'effector-react';
import React from 'react';

import {Col} from '~/shared/ui/components/col';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import * as employeeModel from '../model/employee-model';
import {EmployeeType} from './employee-type';

export const Employee: React.FC = () => {
  const employee = useStore(employeeModel.$employee);
  return (
    <>
      <Row>
        <Col className='basis-3/4'>
          <Row align='center' gap='sm'>
            <Typography as='h2' font='heading'>
              {employee?.name}
            </Typography>
            {employee && <EmployeeType type={employee.type} status={employee.status} />}
          </Row>

          <span>position</span>
          <span>wallet address</span>
          <span>e-mail</span>
          <span>salary</span>
          <span>Invoice period</span>
          <span>Payout type</span>
          <span>Comment</span>
          <div>proposal</div>
          <div>actions history</div>
        </Col>
        <Row>
          <span>...</span>
          <span>Create stream</span>
        </Row>
      </Row>

      <pre>{JSON.stringify({employee}, null, 2)}</pre>
    </>
  );
};
