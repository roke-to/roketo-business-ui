import clsx from 'clsx';
import React from 'react';

import styles from './text.module.css';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: any;
  children?: React.ReactNode;
  color?: string;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({as: Tag = 'span', children, className, color = '', ...props}, ref) => (
    <Tag {...props} className={clsx(`text-${color}`, styles[color], className)} ref={ref}>
      {children}
    </Tag>
  ),
);
