import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {Employee, employeeModel} from '~/entities/employee';

import {Layout} from '@roketo/core/ui/components/layout';

export const EmployeePage = () => {
  const {id} = useParams<{id: string}>();

  useEffect(() => {
    employeeModel.pageLoaded(id);
  }, [id]);

  return (
    <Layout>
      <Employee />
    </Layout>
  );
};
