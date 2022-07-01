import clsx from 'clsx';
import React from 'react';

import styles from './portlet.module.css';

type PortletGap = 'sm' | 'md' | 'lg' | 'xl';

export interface PortletProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: PortletGap | number;
}

export const Portlet = React.forwardRef<HTMLDivElement, PortletProps>(
  ({children, className, gap = 'md', ...props}, ref) => (
    // TODO: using `gap-${gap}` working only if it included in tailwind.config safelist
    <div className={clsx(styles.portlet, className, `gap-${gap}`)} ref={ref} {...props}>
      {children}
    </div>
  ),
);
