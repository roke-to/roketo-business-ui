import clsx from 'clsx';
import React from 'react';

import {Typography} from '../typography';
import styles from './label.module.css';

export type LabelVariant = 'outlined';

export type LabelSize = 'md';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  as?: any;
  content?: React.ReactNode;
  error?: React.ReactNode;
  size?: LabelSize;
  required?: boolean;
}

const DEFAULT_TAG = 'label';

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {as: Tag = DEFAULT_TAG, className, children, content, error, size = 'md', required, ...props},
    ref,
  ) => (
    <Tag
      {...props}
      ref={ref}
      className={clsx(styles.label, styles[size], {[styles.required]: required}, className)}
    >
      <Typography as='span' className={styles.content}>
        {content}
      </Typography>
      {children}
      <div className={styles.errorContainer}>
        <span className={styles.error}>{error}</span>
      </div>
    </Tag>
  ),
);

Label.displayName = 'Label';
