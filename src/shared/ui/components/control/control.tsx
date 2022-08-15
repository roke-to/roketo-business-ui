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
  active,
  onClick,
  disabled,
}: {
  text: number | string;
  icon: React.ReactNode;
  variant: 'positive' | 'negative';
  active: boolean;
  onClick?(): void;
  disabled?: boolean;
}) => {
  const isViewMode = typeof onClick === 'undefined';

  const iconClassName = clsx(styles.icon, styles[variant]);

  return (
    <Row
      align='center'
      gap={1}
      className={clsx(styles.root, {
        [styles.activeMode]: !isViewMode,
        [styles.viewMode]: isViewMode,
      })}
    >
      <Button
        as={isViewMode ? 'div' : 'button'}
        size='xs'
        variant={active ? 'plain' : variant}
        /* @ts-expect-error */
        startIcon={<Icon className={iconClassName} />}
        gap={1}
        className={styles.mobileButton}
        onClick={onClick}
        disabled={disabled}
      >
        <Typography as='span' color={variant} className={styles.text}>
          {text}
        </Typography>
      </Button>
    </Row>
  );
};
