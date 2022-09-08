import React from 'react';
import {useTranslation} from 'react-i18next';

import {EmployeeResponseDto} from '~/shared/api/rb/generated/rb-api';
import {Button} from '~/shared/ui/components/button';

import styles from './employee-status-actions.module.css';

type Props = Pick<EmployeeResponseDto, 'status'>;

export const EmployeeStatusActions: React.FC<Props> = ({status}) => {
  const {t} = useTranslation('employee');
  const buttons = [
    <Button key='Active' className={styles.Active}>
      {t('buttons.activate')}
    </Button>,
    <Button key='Suspended' className={styles.Suspended}>
      {t('buttons.suspend')}
    </Button>,
    <Button key='Fired' className={styles.Fired}>
      {t('buttons.fire')}
    </Button>,
  ];

  return <>{buttons.filter(({key}) => key !== status).map((el) => el)}</>;
};
