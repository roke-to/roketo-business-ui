import clsx from 'clsx';
import React from 'react';

import styles from './typography.module.css';

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'span' | 'p' | 'div';
  color?: 'muted' | 'positive' | 'negative' | 'black';
  font?: string;
  weight?: 'normal' | 'bold' | 'medium' | 'semibold';
  align?: 'left' | 'center' | 'right' | 'justify';
  isCapitalizeFirstLetter?: boolean;
}

// TODO сменить тип HTMLHeadingElement
export const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  (
    {
      as: Tag = 'h1',
      color = '',
      font = 'base',
      align = '',
      weight = 'normal',
      isCapitalizeFirstLetter = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isHeading = ['h1', 'h2', 'h3'].includes(Tag);

    return (
      <Tag
        {...props}
        ref={ref}
        className={clsx(
          `text-${font}`,
          `text-${align}`,
          styles[color],
          styles[weight],
          {
            [styles.heading]: isHeading,
            [styles.capitalizeFirstLetter]: isCapitalizeFirstLetter,
          },
          className,
        )}
      >
        {children}
      </Tag>
    );
  },
);

Typography.displayName = 'Typography';
