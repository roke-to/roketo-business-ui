import clsx from 'clsx';
import React from 'react';

import styles from './button.module.css';

export type ButtonVariant = 'soft' | 'outlined' | 'plain';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: any;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const DEFAULT_TAG = 'button';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as: Tag = DEFAULT_TAG,
      type = Tag === DEFAULT_TAG ? 'button' : undefined,
      children,
      className,
      variant = 'solid',
      size = 'md',
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => (
    <Tag
      {...props}
      ref={ref}
      type={type}
      className={clsx(
        styles.button,
        styles[size],
        styles[variant],
        {[styles.hasIcon]: startIcon || endIcon},
        className,
      )}
    >
      {startIcon}
      {children}
      {endIcon}
    </Tag>
  ),
);
