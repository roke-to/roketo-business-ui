import clsx from 'clsx';
import React from 'react';
import {IThumbProps} from 'react-range/lib/types';

import styles from './thumb.module.css';

export interface ThumbProps extends Partial<IThumbProps> {
  className?: string;
}

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>((props, ref) => (
  <div {...props} ref={ref} className={clsx(styles.thumb, props.className)} />
));

Thumb.displayName = 'Thumb';
