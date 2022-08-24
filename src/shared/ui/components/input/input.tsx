import clsx from 'clsx';
import React from 'react';
import {Merge} from 'type-fest';

import styles from './input.module.css';

export type InputVariant = 'outlined';

export type InputSize = 'md';

// Prefer extends, but override with Omit<..., 'size'> is clumsy
export type InputProps = Merge<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: InputVariant;
    size?: InputSize;
    error?: boolean;
    multiline?: boolean;
    onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
  }
>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      children,
      className,
      variant = 'outlined',
      size = 'md',
      startIcon,
      endIcon,
      error,
      onChange,
      ...props
    },
    ref,
  ) => (
    <input
      {...props}
      ref={ref}
      type={type}
      onChange={(e) => onChange?.(e.target.value, e)}
      className={clsx(
        styles.input,
        styles[size],
        styles[variant],
        {[styles.hasIcon]: startIcon || endIcon},
        {[styles.error]: error},
        className,
      )}
    />
  ),
);

Input.displayName = 'Input';
