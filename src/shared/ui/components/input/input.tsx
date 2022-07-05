import clsx from 'clsx';
import React from 'react';
import {Merge} from 'type-fest';

import styles from './input.module.css';

export type InputVariant = 'outlined';

export type InputSize = 'md';

// Prefer extends, but override with Omit<..., 'size'> is clumsy
type InputProps = Merge<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: InputVariant;
    size?: InputSize;
  }
>;

// ts-unused-exports:disable-next-line
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
      ...props
    },
    ref,
  ) => (
    <input
      {...props}
      ref={ref}
      type={type}
      className={clsx(
        styles.input,
        styles[size],
        styles[variant],
        {[styles.hasIcon]: startIcon || endIcon},
        className,
      )}
    />
  ),
);
