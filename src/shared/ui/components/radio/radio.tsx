import clsx from 'clsx';
import React from 'react';

import {CheckableRoot, ICheckableRootProps} from '../checkable-root';
import styles from './radio.module.css';

interface IRadioProps extends Omit<ICheckableRootProps, 'type'> {
  value: string;
}

export const Radio = React.forwardRef<HTMLInputElement, IRadioProps>(
  ({visualClassName, inputClassName, value, ...props}, ref) => (
    <CheckableRoot
      type='radio'
      visualClassName={clsx(visualClassName, styles.visual)}
      inputClassName={clsx(inputClassName, styles.input)}
      ref={ref}
      visual={<div className={styles.icon} />}
      value={value}
      {...props}
    />
  ),
);

Radio.displayName = 'Radio';
