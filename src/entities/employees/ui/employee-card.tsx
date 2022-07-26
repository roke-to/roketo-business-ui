import React, {useMemo} from 'react';

import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import type {Employee} from '../model/types';

type Props = {
  employee: Employee;
};

export const EmployeeCard: React.FC<Props> = ({employee}) => {
  const labelSubRenders = useMemo(() => {
    const labeledFields = [
      {
        content: 'Role',
        children: employee.role,
      },
      {
        content: 'wallet address',
        children: employee.wallet,
      },
      {
        content: 'e-mail',
        children: employee.email,
      },
      {
        content: 'Salary',
        children: `${employee.salary} (salary frequency)`,
      },
      {
        content: 'Comment',
        children: employee.comment,
      },
    ];

    return labeledFields
      .filter(({children}) => Boolean(children))
      .map(({children, content}) => (
        <Label as='div' content={content}>
          <Typography>{children}</Typography>
        </Label>
      ));
  }, [employee]);

  return (
    <Portlet>
      <Row>
        <Typography>{employee.name}</Typography>
        <pre>{JSON.stringify({status: employee.status}, null, 2)}</pre>
      </Row>
      <Col>{labelSubRenders}</Col>
      <Button>Actions</Button>
    </Portlet>
  );
};
