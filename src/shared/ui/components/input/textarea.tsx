/* eslint-disable react/prop-types */
import autosize from 'autosize';
import clsx from 'clsx';
import React from 'react';
import {Merge} from 'type-fest';

import styles from './input.module.css';

export type TextareaVariant = 'outlined';

export type TextareaSize = 'md';

// Prefer extends, but override with Omit<..., 'size'> is clumsy
export type TextAreaProps = Merge<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  {
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: TextareaVariant;
    size?: TextareaSize;
    error?: boolean;
    multiline?: boolean;
    onChange?: (value: string, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }
>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      multiline,
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

    const handleChange = React.useCallback(
      (event) => onChange?.(event.target.value, event),
      [onChange],
    );

    React.useEffect(() => {
      autosize(currentRef.current!);

      return () => autosize.destroy(currentRef.current!);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <textarea
        {...props}
        ref={handleRef}
        onChange={handleChange}
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

Textarea.displayName = 'Textarea';
