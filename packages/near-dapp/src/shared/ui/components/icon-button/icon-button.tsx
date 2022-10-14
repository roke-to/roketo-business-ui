import clsx from 'clsx';
import React from 'react';

import {Button, ButtonProps} from '../button';
import styles from './icon-button.module.css';

export interface IconButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon'> {}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({className, size = 'md', ...props}, ref) => (
    <Button
      {...props}
      size={size}
      ref={ref}
      className={clsx(styles.root, styles[size], className)}
    />
  ),
);

IconButton.displayName = 'IconButton';
