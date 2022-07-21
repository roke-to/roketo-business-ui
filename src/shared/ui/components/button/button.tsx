import clsx from 'clsx';
import React from 'react';

import styles from './button.module.css';

export type ButtonVariant = 'soft' | 'outlined' | 'plain' | 'positive' | 'negative' | 'clean';

export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: any;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  gap?: 'sm' | number;
  width?: 'full';
}

const DEFAULT_TAG = 'button';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as: Tag = DEFAULT_TAG,
      type = Tag === DEFAULT_TAG ? 'button' : undefined,
      children,
      className,
      variant = 'soft',
      size = 'md',
      width = '',
      startIcon,
      endIcon,
      gap,
      ...props
    },
    ref,
  ) => {
    const hasGap = gap || gap === 0;
    return (
      <Tag
        {...props}
        ref={ref}
        type={type}
        className={clsx(
          styles.button,
          styles[size],
          styles[variant],
          styles[width],
          {[styles.hasIcon]: (startIcon || endIcon) && !hasGap},
          `gap-${gap}`,
          className,
        )}
      >
        {startIcon}
        {children}
        {endIcon}
      </Tag>
    );
  },
);
