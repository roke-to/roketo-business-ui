import clsx from 'clsx';
import React from 'react';

import {Button} from '~/shared/ui/components/button';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';

import styles from './council-control.module.css';

export const CouncilControl = ({
  council,
  action,
  onClick,
}: {
  council: string;
  action?: 'delete' | 'add';
  onClick(props: {council: string; action: 'delete' | 'add'}): void;
}) => (
  <Row className='justify-between items-start'>
    <Typography as='span' weight='bold' className={styles[`${action}Text`]}>
      {council}
    </Typography>
    {action && (
      <Button
        size='xxs'
        startIcon={<Plus className={clsx(styles.icon, styles[`${action}Icon`])} />}
        className={styles.button}
        onClick={() => onClick({council, action})}
      />
    )}
  </Row>
);
