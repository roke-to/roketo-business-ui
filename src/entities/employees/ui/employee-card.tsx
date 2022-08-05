import clsx from 'clsx';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import type {Employee} from '~/shared/types/employee';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './employee-card.module.css';
import {Status} from './status';

type Props = {
  employee: Employee;
};

export const EmployeeCard: React.FC<Props> = ({employee}) => {
  const {t} = useTranslation('employees');

  const labelSubRenders = useMemo(() => {
    const labeledFields = [
      {
        content: t('employeeCard.labels.role'),
        children: employee.role,
      },
      {
        content: t('employeeCard.labels.wallet'),
        children: employee.wallet,
      },
      {
        content: t('employeeCard.labels.email'),
        children: employee.email,
      },
      {
        content: t('employeeCard.labels.salary'),
        children: `${employee.salary} (salary frequency)`,
      },
      {
        content: t('employeeCard.labels.comment'),
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
  }, [employee, t]);

  return (
    <Portlet className={clsx(styles.card)} justify='between'>
      <div>
        <Row align='center' gap='sm' className='mb-2'>
          <Typography>{employee.name}</Typography>
          <Status status={employee.status} type={employee.type} />
        </Row>
        <Col gap='xs'>{labelSubRenders}</Col>
      </div>
      <Button>{t('employeeCard.button')}</Button>
    </Portlet>
  );
};
