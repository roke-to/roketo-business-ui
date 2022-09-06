import React from 'react';
import {useParams} from 'react-router-dom';

import {Layout} from '~/shared/ui/components/layout';

export const EmployeePage = () => {
  const {id} = useParams<{id: string}>();

  return <Layout>Employee Page #{id}</Layout>;
};
