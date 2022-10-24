import React from 'react';
import {useTranslation} from 'react-i18next';

import {Typography} from 'ui/components/typography';

import styles from './empty-employee-list.module.css';

export const EmptyEmployeeList = ({
  isDefaultFiltersValue,
  createEmployeeComponent,
}: {
  isDefaultFiltersValue?: boolean;
  createEmployeeComponent: React.ReactNode;
}) => {
  const {t} = useTranslation('employees');

  const text = isDefaultFiltersValue ? t('list.emptyList') : t('list.emptySearch');
  const showCreateButton = isDefaultFiltersValue;

  return (
    <div className={styles.container}>
      <Typography
        as='span'
        color='muted'
        align='center'
        dangerouslySetInnerHTML={{__html: text.replace('\n', '<br/>')}}
      />
      {showCreateButton && createEmployeeComponent}
    </div>
  );
};
