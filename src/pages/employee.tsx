import {useStore} from 'effector-react';
import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {employeeModel} from '~/entities/employee';
import {Layout} from '~/shared/ui/components/layout';

export const EmployeePage = () => {
  const {id} = useParams<{id: string}>();
  const employee = useStore(employeeModel.$employee);

  useEffect(() => {
    employeeModel.pageLoaded(id);
  }, [id]);

  return (
    <Layout>
      <span>Employee Page #{id}</span>
      <pre>{JSON.stringify({employee}, null, 2)}</pre>
    </Layout>
  );
};
