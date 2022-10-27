import clsx from 'clsx';
import React from 'react';

import {Button} from '../button';
import {Row} from '../row';
import {Typography} from '../typography';
import styles from './control.module.css';

export const Control = ({
  text,
  icon: Icon,
  variant,
  highlight,
  onClick,
  disabled,
}: {
  text: number | string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  variant: 'positive' | 'negative';
  highlight: boolean;
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
        variant={highlight ? variant : 'plain'}
        startIcon={<Icon className={iconClassName} />}
        gap={1}
        className={styles.mobileButton}
        onClick={onClick}
        disabled={disabled}
        data-enabled={!disabled}
      >
        <Typography as='span' color={variant} className={styles.text}>
          {text}
        </Typography>
      </Button>
    </Row>
  );
};
