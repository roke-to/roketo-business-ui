import clsx from 'clsx';
import React from 'react';

import styles from './scene.module.css';

export interface SceneProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Scene = React.forwardRef<HTMLDivElement, SceneProps>(
  ({children, className, ...props}, ref) => (
    <div ref={ref} className={clsx(styles.scene, className)} {...props}>
      {children}
    </div>
  ),
);
