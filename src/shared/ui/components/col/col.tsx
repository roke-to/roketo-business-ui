import clsx from 'clsx';
import React from 'react';

import styles from './col.module.css';

type ColAlign = 'left' | 'right' | 'center';
type ColGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: ColAlign;
  gap?: ColGap | number;
}

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({children, className, gap = 'md', align = '', ...props}, ref) => (
    // TODO: using gap && `gap-${gap}` working only if it included in tailwind.config safelist
    // TODO: maybe make some helper like useTailwindProps
    <div
      className={clsx(styles.col, className, styles[align], gap && `gap-${gap}`)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);

Col.displayName = 'Col';
