import clsx from 'clsx';
import React from 'react';

import styles from './col.module.css';

type ColAlign = 'left' | 'right' | 'center';
type ColGap = 'sm' | 'md' | 'lg' | 'xl';

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: any;
  align?: ColAlign;
  gap?: ColGap | number;
}

export const Col = React.forwardRef<HTMLElement, ColProps>(
  ({as: Tag = 'div', children, className, gap = 'md', align = '', ...props}, ref) => (
    // TODO: using `gap-${gap}` working only if it included in tailwind.config safelist
    // TODO: maybe make some helper like useTailwindProps
    <Tag className={clsx(styles.col, className, styles[align], `gap-${gap}`)} ref={ref} {...props}>
      {children}
    </Tag>
  ),
);
