import clsx from 'clsx';
import React from 'react';

import styles from './checkable-root.module.css';

export interface ICheckableRootProps {
  type: 'checkbox' | 'radio';
  name?: string;
  id?: string;
  label?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
  className?: string;
  visualClassName?: string;
  inputClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => boolean | void;
  visual?: JSX.Element;
}

export const CheckableRoot = React.forwardRef<HTMLInputElement, ICheckableRootProps>(
  (
    {
      type,
      id,
      name,
      checked,
      disabled,
      defaultChecked,
      className,
      inputClassName,
      visualClassName,
      onChange,
      visual,
      ...props
    },
    ref,
  ) => (
    <span className={clsx(styles.root, className)}>
      <input
        type={type}
        ref={ref}
        name={name}
        id={id}
        checked={checked}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={disabled ? undefined : onChange}
        className={clsx(styles.input, inputClassName)}
        {...props}
      />

      <span className={clsx(styles.visual, visualClassName, className)}>{visual}</span>
    </span>
  ),
);

CheckableRoot.displayName = 'CheckableRoot';
