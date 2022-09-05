import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button} from '~/shared/ui/components/button';
import {Label} from '~/shared/ui/components/label';
import {Layout} from '~/shared/ui/components/layout';
import {useModal} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';

import * as employeesModel from '../model/employees-model';
import {AddEmployeeModal} from './add-employee-modal';
import {EmployeeCard} from './employee-card';
import {EmployeeListItem} from './employee-list-item';
import styles from './employees-page.module.css';
import {Filter} from './filter';

type ViewType = 'card' | 'list';

export const EmployeesPage = () => {
  const {t} = useTranslation('employees');
  const addEmployeeModal = useModal();

  const employees = useStore(employeesModel.$employees);
  const selectedStatus = useStore(employeesModel.$statusFilter);
  const selectedType = useStore(employeesModel.$typeFilter);

  useEffect(() => {
    employeesModel.pageLoaded();
  }, []);

  const [viewType, setViewType] = useState<ViewType>('card');
  const handleViewTypeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setViewType(e.target.value as ViewType);

  return (
    <Layout>
      <Row>
        <Button onClick={addEmployeeModal.show}>{t('addEmployee.button')}</Button>
        <AddEmployeeModal
          isOpen={addEmployeeModal.isOpen}
          title={t('addEmployee.modal.title')}
          onCloseModal={addEmployeeModal.hide}
        />
      </Row>

      <Row justify='between'>
        <Row align='center' gap='sm'>
          <Filter
            title={t('filters.status.title')}
            selected={selectedStatus}
            options={employeesModel.statusFilterOptions}
            dropdownLabel={t(`filters.status.values.${selectedStatus}`)}
            // TODO useTranslation ругается на попытку обратиться по этому пути стрингой
            // @ts-expect-error
            generateDropdownItem={(status) => t(`filters.status.values.${status}`)}
            handleChange={employeesModel.statusFilterChanged}
          />

          <Filter
            title={t('filters.type.title')}
            selected={selectedType}
            options={employeesModel.typeFilterOptions}
            dropdownLabel={t(`filters.type.values.${selectedType}`)}
            // TODO useTranslation ругается на попытку обратиться по этому пути стрингой
            // @ts-expect-error
            generateDropdownItem={(status) => t(`filters.type.values.${status}`)}
            handleChange={employeesModel.typeFilterChanged}
          />
        </Row>
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
    </Layout>
  );
};
