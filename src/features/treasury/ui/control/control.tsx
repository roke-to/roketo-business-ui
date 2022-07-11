import clsx from 'clsx';
import React from 'react';

import {Button} from '~/shared/ui/components/button';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './control.module.css';

export const Control = ({
  text,
  icon: Icon,
  variant,
}: {
  text: number;
  icon: React.ReactNode;
  variant: 'positive' | 'negative';
}) => {
  const iconClassName = clsx(styles.icon, styles[variant]);

  return (
    <Row align='center' gap={1}>
      <Typography as='span' textClassName='muted'>
        {text}
      </Typography>
      <Button
        size='xs'
        variant={variant}
        /* @ts-expect-error */
        startIcon={<Icon className={iconClassName} />}
      />
    </Row>
  );
};
