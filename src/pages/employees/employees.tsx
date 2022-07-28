import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useEffect} from 'react';

import {EmployeeCard, employeesModel} from '~/entities/employees';
import {Button} from '~/shared/ui/components/button';
import {Row} from '~/shared/ui/components/row';
import {PageLayout} from '~/widgets/page-layout';

import styles from './employees.module.css';

export const EmployeesPage = () => {
  const employees = useStore(employeesModel.$employees);

  useEffect(() => {
    employeesModel.pageLoaded();
  }, []);

  return (
    <PageLayout>
      <Row>
        <Button>Add new employee</Button>
      </Row>
      <div className={clsx(styles.wrapper)}>
        {employees.map((employee) => (
          <EmployeeCard employee={employee} key={employee.id} />
        ))}
      </div>
    </PageLayout>
  );
};
