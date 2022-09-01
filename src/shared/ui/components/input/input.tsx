import autosize from 'autosize';
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
      multiline,
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
  ) => {
    const Tag = multiline ? 'textarea' : 'input';
    const currentRef = React.useRef(null);

    const handleRef = React.useCallback(
      (node) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref !== null && typeof ref === 'object') {
          // eslint-disable-next-line no-param-reassign
          ref.current = node;
        }

        currentRef.current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      if (Tag === 'textarea') {
        autosize(currentRef.current!);
      }

      return () => autosize.destroy(currentRef.current!);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      // @ts-expect-error
      <Tag
        {...props}
        ref={handleRef}
        type={type}
        onChange={(e) => onChange?.(e.target.value, e as React.ChangeEvent<HTMLInputElement>)}
        className={clsx(
          styles.input,
          styles[size],
          styles[variant],
          {[styles.hasIcon]: startIcon || endIcon},
          {[styles.error]: error},
          className,
        )}
      />
    );
  },
);

Input.displayName = 'Input';
