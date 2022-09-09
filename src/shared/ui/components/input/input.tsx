/* eslint-disable react/prop-types */
import clsx from 'clsx';
import React from 'react';
import {IMaskInput} from 'react-imask';
import {Merge} from 'type-fest';

import styles from './input.module.css';
import {MaskOptions, maskTypes} from './mask-types';

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
    value?: string;
    name?: string;
    disabled?: boolean;
    size?: InputSize;
    mask?: keyof typeof maskTypes;
    maskOptions?: MaskOptions;
    postfix?: string;
    error?: boolean;
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
      mask: maskType,
      maskOptions,
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

    const handleAccept = React.useCallback(
      (value, mask, event) => onChange?.(mask.unmaskedValue, event),
      [onChange],
    );

    const maskProps = React.useMemo(
      () => (maskType ? maskTypes[maskType]({...maskOptions, value: props.value}) : {}),
      [maskType, maskOptions, props.value],
    );

    const onChangeProps = React.useMemo(
      () => (maskType ? {onAccept: handleAccept} : {onChange: handleChange}),
      [maskType, handleAccept, handleChange],
    );

    return (
      // @ts-expect-error ref not matching
      <IMaskInput
        {...props}
        {...maskProps}
        {...onChangeProps}
        ref={handleRef}
        type={type}
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
