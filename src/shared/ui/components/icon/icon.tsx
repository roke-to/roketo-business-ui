import clsx from 'clsx';
import React from 'react';

import styles from './icon.module.css';

export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  as?: any;
  alt?: string;
}

export const Icon = React.forwardRef<HTMLImageElement, IconProps>(
  ({as: Tag = 'img', className, alt = '', ...props}, ref) => (
    <Tag {...props} ref={ref} className={clsx(styles.icon, className)} alt={alt} />
  ),
);
