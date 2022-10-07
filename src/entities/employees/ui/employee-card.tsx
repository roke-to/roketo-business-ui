import clsx from 'clsx';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import type {EmployeeResponseDto} from '~/shared/api/rb';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './employee-card.module.css';
import {EmployeeStatus} from './employee-status';

type Props = {
  employee: EmployeeResponseDto;
};

export const EmployeeCard: React.FC<Props> = ({employee}) => {
  const {t} = useTranslation('employees');

  const labelSubRenders = useMemo(() => {
    const labeledFields = [
      {
        content: t('card.labels.role'),
        children: employee.position,
      },
      {
        content: t('card.labels.wallet'),
        children: employee.nearLogin,
      },
      {
        content: t('card.labels.email'),
        children: employee.email,
      },
      {
        content: t('card.labels.salary'),
        children: `${employee.salary || 0} ${employee.token} (${
          employee.payPeriod || 2
        } per month)`,
      },
      {
        content: t('card.labels.comment'),
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
          <EmployeeStatus status={employee.status} type={employee.type} />
        </Row>
        <Col gap='xs'>{labelSubRenders}</Col>
      </div>
      <Button>{t('card.button')}</Button>
    </Portlet>
  );
};
