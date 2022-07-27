import clsx from 'clsx';
import React, {useMemo} from 'react';

import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import type {Employee} from '../model/types';
import styles from './employee-card.module.css';

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
        <Label as='div' content={content} key={content}>
          <Typography>{children}</Typography>
        </Label>
      ));
  }, [employee]);

  // TODO: статус можно вынести в компонент если будет нужен где-то ещё
  const statusColor = useMemo(() => {
    const map = {
      // TODO: запровайдить тему, тащить цвета из контекста
      Active: '#1EBA52',
      Suspended: '#E87C4C',
      Fired: '#D80A1F',
    };

    const color = map[employee.status];
    const hasFill = employee.type === 'Contractor';
    return {
      borderColor: color,
      bgColor: hasFill ? color : 'none',
    };
  }, [employee]);
  const statusStyle = {
    '--borderColor': statusColor.borderColor,
    '--bgColor': statusColor.bgColor,
  } as React.CSSProperties;

  return (
    <Portlet>
      <Row align='center' gap='sm'>
        <Typography>{employee.name}</Typography>
        <div className={clsx(styles.status)} style={statusStyle} />
      </Row>
      <Col>{labelSubRenders}</Col>
      <Button>Actions</Button>
    </Portlet>
  );
};
