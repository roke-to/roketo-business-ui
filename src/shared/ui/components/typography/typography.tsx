import clsx from 'clsx';
import React from 'react';

import styles from './typography.module.css';

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'span';
  color?: string;
  font?: string;
  weight?: 'normal' | 'bold';
}

// TODO сменить тип HTMLHeadingElement
export const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  (
    {as: Tag = 'h1', color = '', font = 'base', weight = '', className, children, ...props},
    ref,
  ) => {
    const isHeading = ['h1', 'h2', 'h3'].includes(Tag);

    return (
      <Tag
        {...props}
        ref={ref}
        className={clsx(
          `text-${font}`,
          styles[color],
          styles[weight],
          {
            [styles.heading]: isHeading,
          },
          className,
        )}
      >
        {children}
      </Tag>
    );
  },
);
