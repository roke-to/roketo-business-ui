import clsx from 'clsx';
import React from 'react';

import styles from './text.module.css';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: any;
  color?: string;
  text?: string;
}

// Depreccated move to Typography
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({as: Tag = 'span', children, className, color = '', text = 'base', ...props}, ref) => (
    <Tag {...props} className={clsx(`text-${text}`, styles[color], className)} ref={ref}>
      {children}
    </Tag>
  ),
);
