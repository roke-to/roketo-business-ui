import clsx from 'clsx';
import React, {FC, InputHTMLAttributes} from 'react';

import styles from './styles.module.scss';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: React.ReactNode;
  hasError?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({
  description,
  className,
  hasError = false,
  disabled = false,
  ...rest
}) => (
  <label className={clsx(styles.root, disabled && styles.disabled, className)}>
    <input
      type='checkbox'
      className={clsx(styles.checkbox, {[styles.error]: hasError})}
      disabled={disabled}
      {...rest}
    />
    {description && <div className={styles.description}>{description}</div>}
  </label>
);