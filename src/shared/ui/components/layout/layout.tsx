import clsx from 'clsx';
import React from 'react';

import styles from './layout.module.css';

export type SceneGap = 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: any;
  gap?: SceneGap | number;
  type?: 'row' | 'column';
  withContent?: boolean;
  withBackground?: boolean;
  marginLeft?: 'sidebar';
}

const DEFAULT_TAG = 'div';

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      as: Tag = DEFAULT_TAG,
      gap,
      type = 'column',
      withBackground = true,
      withContent,
      marginLeft = '',
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <Tag
      ref={ref}
      className={clsx(
        `gap-${gap}`,
        styles[type],
        styles[marginLeft],
        {
          [styles.scene]: withBackground,
          [styles.layout]: !withBackground,
          [styles.content]: withContent,
        },
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  ),
);
