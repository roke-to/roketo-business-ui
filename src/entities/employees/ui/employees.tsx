import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useRouteMatch} from 'react-router-dom';

import {Col} from '~/shared/ui/components/col';
import {IconButton} from '~/shared/ui/components/icon-button';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as CardViewIcon} from '~/shared/ui/icons/employees/cards.svg';
import {ReactComponent as ListViewIcon} from '~/shared/ui/icons/employees/list.svg';

import * as employeesModel from '../model/employees-model';
import {CreateEmployeeButton} from './create-employee-button';
import {DraftInvoice} from './draft-invoice';
import {EmployeeCard} from './employee-card';
import {EmployeeListItem} from './employee-list-item';
import styles from './employees.module.css';
import {Filter} from './filter';

type ViewType = 'card' | 'list';

export const Employees = () => {
  const {url} = useRouteMatch();

  const {t} = useTranslation('employees');

  const employees = useStore(employeesModel.$employees);
  const selectedStatus = useStore(employeesModel.$statusFilter);
  const selectedType = useStore(employeesModel.$typeFilter);
  const selectedSort = useStore(employeesModel.$sort);

  const draftInvoices = useStore(employeesModel.$draftInvoices);

  useEffect(() => {
    employeesModel.pageLoaded();
  }, []);

  const [viewType, setViewType] = useState<ViewType>('card');
  const handleViewTypeChange = (payload: ViewType) => setViewType(payload);

  return (
    <>
      <Row>
        <CreateEmployeeButton />
      </Row>

      {draftInvoices.length ? (
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
      ) : null}

      <Row>
        <Typography as='h2' font='heading'>
          {t('titles.employeesList')}
        </Typography>
      </Row>
      <Row justify='between' align='center'>
        <Row align='center'>
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
            generateDropdownItem={(type) => t(`filters.type.values.${type}`)}
            handleChange={employeesModel.typeFilterChanged}
          />
        </Row>
        <Row align='center' gap='sm'>
          <Filter
            title={t('sort.title')}
            selected={selectedSort}
            options={employeesModel.sortOptions}
            dropdownLabel={t(`sort.values.${selectedSort}`)}
            // TODO useTranslation ругается на попытку обратиться по этому пути стрингой
            // @ts-expect-error
            generateDropdownItem={(sort) => t(`sort.values.${sort}`)}
            handleChange={employeesModel.sortChanged}
          />

          <IconButton variant='clean' size='sm' onClick={() => handleViewTypeChange('card')}>
            <CardViewIcon
              className={clsx(styles.viewTypeIcon, {
                [styles.active]: viewType === 'card',
              })}
            />
          </IconButton>
          <IconButton variant='clean' size='sm' onClick={() => handleViewTypeChange('list')}>
            <ListViewIcon
              className={clsx(styles.viewTypeIcon, {
                [styles.active]: viewType === 'list',
              })}
            />
          </IconButton>
        </Row>
      </Row>
      <div className={clsx(styles.wrapper, styles[viewType])}>
        {employees.map((employee) => {
          if (viewType === 'card') {
            return (
              <Link to={`${url}/${employee.id}`} key={employee.id}>
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
