import React from 'react';
import {useTranslation} from 'react-i18next';

import {EmployeeResponseDto} from '~/shared/api/rb/generated/rb-api';

import {Button} from '@roketo/core/ui/components/button';

import * as employeeModel from '../model/employee-model';
import styles from './employee-status-actions.module.css';

type Props = Pick<EmployeeResponseDto, 'status'>;

export const EmployeeStatusActions: React.FC<Props> = ({status}) => {
  const {t} = useTranslation('employee');
  const buttons = [
    <Button
      key='Active'
      className={styles.activate}
      onClick={() => employeeModel.employeeStatusChanged('Reinstate')}
    >
      {t('buttons.activate')}
    </Button>,
    <Button
      key='Suspended'
      className={styles.suspend}
      onClick={() => employeeModel.employeeStatusChanged('Suspend')}
    >
      {t('buttons.suspend')}
    </Button>,
    <Button
      key='Fired'
      className={styles.fire}
      onClick={() => employeeModel.employeeStatusChanged('Fire')}
    >
      {t('buttons.fire')}
    </Button>,
  ];

  return <>{buttons.filter(({key}) => key !== status).map((el) => el)}</>;
};
