import clsx from 'clsx';
import React from 'react';

import {IconButton} from '@roketo/core/ui/components/icon-button';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';
import {ReactComponent as Plus} from '@roketo/core/ui/icons/plus.svg';

import styles from './council-control.module.css';

export const CouncilControl = ({
  council,
  willDelete,
  onClick,
}: {
  council: string;
  willDelete: boolean;
  onClick(council: string): void;
}) => (
  <Row className='justify-between items-start'>
    <Typography
      as='span'
      weight='bold'
      className={clsx('truncate', {
        [styles.text]: willDelete,
        [styles.deleteText]: !willDelete,
      })}
    >
      {council}
    </Typography>
    <IconButton size='xxs' onClick={() => onClick(council)}>
      <Plus className={clsx({[styles.deleteIcon]: !willDelete})} />
    </IconButton>
  </Row>
);
