import clsx from 'clsx';
import React, {PropsWithChildren} from 'react';

import styles from '~/shared/ui/components/list/list.module.css';

export type ListGap = 'sm' | 'md' | 'lg';

export interface ListProps {
  gap?: number | ListGap;
  className?: string;
}

export const List = React.forwardRef<HTMLUListElement, PropsWithChildren<ListProps>>(
  ({gap, className, children}, ref) => (
    <ul ref={ref} className={clsx(styles.list, gap && `gap-${gap}`, className)}>
      {children}
    </ul>
  ),
);
