import clsx from 'clsx';
import React from 'react';

import styles from './portlet.module.css';

type PortletGap = 'sm' | 'md' | 'lg' | 'xl';
type PortletJustify = 'start' | 'end' | 'between';
type PortletWidth = 'full';

export interface PortletProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: PortletGap | number;
  type?: 'row' | 'column';
  width?: PortletWidth;
  justify?: PortletJustify;
}

export const Portlet = React.forwardRef<HTMLDivElement, PortletProps>(
  ({gap = 'md', type = '', width = '', className, justify = 'start', children, ...props}, ref) => (
    // TODO: using gap && `gap-${gap}` working only if it included in tailwind.config safelist
    <div
      className={clsx(
        styles.portlet,
        styles[type],
        styles[width],
        styles[justify],
        gap && `gap-${gap}`,
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);
