import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Col} from '~/shared/ui/components/col';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import * as employeeModel from '../model/employee-model';
import {EmployeeType} from './employee-type';

export const Employee: React.FC = () => {
  const {t} = useTranslation('employee');
  const employee = useStore(employeeModel.$employee);
  return (
    employee && (
      <Row>
        <Col className='basis-3/4'>
          <Row align='center' gap='sm'>
            <Typography as='h2' font='heading'>
              {employee.name}
            </Typography>
            <EmployeeType type={employee.type} status={employee.status} />
          </Row>
          <div className='grid gap-6 mb-4 desktop:grid-cols-3'>
            <Label as='div' content={t('labels.position')}>
              <Typography>{employee.position}</Typography>
            </Label>
            <Label as='div' content={t('labels.nearLogin')}>
              <Typography>{employee.nearLogin}</Typography>
            </Label>
            <Label as='div' content={t('labels.email')}>
              <Typography>{employee.email || '—'}</Typography>
            </Label>
            <Label as='div' content={t('labels.salary')}>
              <Typography>{employee.salary}</Typography>
            </Label>
            <Label as='div' content={t('labels.payPeriod')}>
              <Typography>{employee.payPeriod}</Typography>
            </Label>
            <Label as='div' content={t('labels.payoutType')}>
              {/* TODO у нас нет под это поля в базе */}
              <Typography>Smooth</Typography>
            </Label>
            {employee.comment && (
              <Label as='div' content={t('labels.comment')} className='desktop:col-span-3'>
                <Typography>{employee.comment}</Typography>
              </Label>
            )}
          </div>
          <div>proposal</div>
          <div>actions history</div>
        </Col>
        <Row>
          <span>Create stream</span>
          <span>...</span>
        </Row>
      </Row>
    )
  );
};
