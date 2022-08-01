import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {EmployeeCard, EmployeeListItem, employeesModel} from '~/entities/employees';
import {Button} from '~/shared/ui/components/button';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {PageLayout} from '~/widgets/page-layout';

import styles from './employees.module.css';

type ViewType = 'card' | 'list';

export const EmployeesPage = () => {
  const {t} = useTranslation('employees');

  const employees = useStore(employeesModel.$employees);

  useEffect(() => {
    employeesModel.pageLoaded();
  }, []);

  const [viewType, setViewType] = useState<ViewType>('card');
  const handleViewTypeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setViewType(e.target.value as ViewType);

  return (
    <PageLayout>
      <Row>
        <Button>{t('employeesPage.addEmployee.button')}</Button>
      </Row>
      <Row justify='between'>
        <div>filters</div>
        <Row>
          <Label content='Card view'>
            <input
              type='radio'
              name='viewType'
              value='card'
              checked={viewType === 'card'}
              onChange={handleViewTypeChange}
            />
          </Label>
          <Label content='List view'>
            <input
              type='radio'
              name='viewType'
              value='list'
              checked={viewType === 'list'}
              onChange={handleViewTypeChange}
            />
          </Label>
        </Row>
      </Row>
      <div className={clsx(styles.wrapper, styles[viewType])}>
        {employees.map((employee) => {
          if (viewType === 'card') {
            return <EmployeeCard employee={employee} key={employee.id} />;
          }

          return <EmployeeListItem employee={employee} key={employee.id} />;
        })}
      </div>
    </PageLayout>
  );
};
