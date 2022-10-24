import clsx from 'clsx';
import React from 'react';

import styles from './row.module.css';

type RowAlign = 'left' | 'right' | 'center';
type RowJustify = 'start' | 'between' | 'end';
type RowGap = 'sm' | 'md' | 'lg' | 'xl';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: RowAlign;
  justify?: RowJustify;
  gap?: RowGap | number;
}

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({children, className, gap = 'md', align = '', justify = '', ...props}, ref) => (
    // TODO: using gap && `gap-${gap}` working only if it included in tailwind.config safelist
    // TODO: maybe make some helper like useTailwindProps
    <div
      {...props}
      ref={ref}
      className={clsx(styles.row, styles[align], styles[justify], gap && `gap-${gap}`, className)}
    >
      {children}
    </div>
  ),
);

Row.displayName = 'Row';
