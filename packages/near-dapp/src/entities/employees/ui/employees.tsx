import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useRouteMatch} from 'react-router-dom';

import {Col} from '@roketo/core/ui/components/col';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

import * as employeesModel from '../model/employees-model';
import {CreateEmployeeButton} from './create-employee-button';
import {DraftInvoice} from './draft-invoice';
import {EmployeeCard} from './employee-card';
import {EmployeeListItem} from './employee-list-item';
import {EmployeesFilters} from './employees-filters';
import styles from './employees.module.css';
import {EmptyEmployeeList} from './empty-employee-list';

export type ViewType = 'card' | 'list';

export const Employees = () => {
  const {url} = useRouteMatch();

  const {t} = useTranslation('employees');

  const employees = useStore(employeesModel.$employees);
  const selectedStatus = useStore(employeesModel.$statusFilter);
  const selectedType = useStore(employeesModel.$typeFilter);

  const draftInvoices = useStore(employeesModel.$draftInvoices);

  useEffect(() => {
    employeesModel.pageLoaded();
  }, []);

  const [viewType, setViewType] = useState<ViewType>('card');

  const isDefaultFiltersValue = selectedStatus === 'all' && selectedType === 'all';
  const isEmployeeListEmpty = employees.length === 0;

  return (
    <>
      {draftInvoices.length > 0 && (
        <>
          <Row>
            <Typography as='h2' font='heading'>
              {t('titles.comingSoonPayments')}
            </Typography>
          </Row>
          <Col>
            {draftInvoices.map((draftInvoice) => (
              <DraftInvoice
                clickHandler={() => employeesModel.invoiceDraftModalOpened(draftInvoice)}
                draftInvoice={draftInvoice}
                key={draftInvoice.id}
              />
            ))}
          </Col>
        </>
      )}

      <Row justify='between'>
        <Typography as='h2' font='heading'>
          {t('titles.employeesList')}
        </Typography>
        <CreateEmployeeButton size='sm' />
      </Row>

      <EmployeesFilters viewType={viewType} setViewType={setViewType} />

      <div
        className={clsx(styles.wrapper, styles[viewType], {[styles.isEmpty]: isEmployeeListEmpty})}
      >
        {employees.length === 0 && (
          <EmptyEmployeeList
            isDefaultFiltersValue={isDefaultFiltersValue}
            createEmployeeComponent={<CreateEmployeeButton />}
          />
        )}
        {employees.map((employee) => {
          if (viewType === 'card') {
            return (
              <Link to={`${url}/${employee.id}`} key={employee.id} className='flex'>
                <EmployeeCard employee={employee} />
              </Link>
            );
          }

          return (
            <Link to={`${url}/${employee.id}`} key={employee.id}>
              <EmployeeListItem employee={employee} />
            </Link>
          );
        })}
      </div>
    </>
  );
};
