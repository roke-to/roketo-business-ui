import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button} from '~/shared/ui/components/button';
import {Label} from '~/shared/ui/components/label';
import {useModal} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';
import {PageLayout} from '~/widgets/page-layout';

import * as employeesModel from '../model/employees-model';
import {AddEmployeeModal} from './add-employee-modal';
import {EmployeeCard} from './employee-card';
import {EmployeeListItem} from './employee-list-item';
import styles from './employees-page.module.css';

type ViewType = 'card' | 'list';

export const EmployeesPage = () => {
  // TODO extract i18n for page from entity
  const {t} = useTranslation('employees');
  const addEmployeeModal = useModal();

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
        <Button onClick={addEmployeeModal.show}>{t('addEmployee.button')}</Button>
        <AddEmployeeModal
          isOpen={addEmployeeModal.isOpen}
          title={t('addEmployee.modal.title')}
          onCloseModal={addEmployeeModal.hide}
        />
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
