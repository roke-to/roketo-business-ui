import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

// TODO fix FSD
import {CreateStreamProposalButton} from '~/entities/streams/create-stream-proposal-button';
import {Col} from '~/shared/ui/components/col';
import {IconButton} from '~/shared/ui/components/icon-button';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as ThreeDotsIcon} from '~/shared/ui/icons/dots.svg';

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
              {/* TODO как будто бы нужно отдельное поле для валюты */}
              <Typography>{employee.salary} USD</Typography>
            </Label>
            <Label as='div' content={t('labels.payPeriod')}>
              {/* TODO нужно поле которое укажет  на каком промежутке работает период (per month etc.) */}
              <Typography>{employee.payPeriod} per month</Typography>
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
        <Col>
          <Row>
            <CreateStreamProposalButton />
            <IconButton>
              <ThreeDotsIcon className='fill-blue-textDefault' />
            </IconButton>
          </Row>
        </Col>
      </Row>
    )
  );
};
