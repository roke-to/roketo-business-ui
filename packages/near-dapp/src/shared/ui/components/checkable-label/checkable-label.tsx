import clsx from 'clsx';
import React from 'react';

import styles from './checkable-label.module.css';

type IContent = string | React.ReactElement;

export type CheckableLabelPosition = 'left' | 'right';

export interface ICheckableLabelProps {
  label?: IContent;
  title?: string;
  labelPosition?: CheckableLabelPosition;
  disabled?: boolean;
  className?: string;
}

export const CheckableLabel: React.FC<ICheckableLabelProps> = ({
  children,
  label,
  title = typeof label === 'string' ? label : undefined,
  labelPosition = 'left',
  className,
  disabled,
}) => {
  const textClasses = clsx(styles.text, {
    [styles.disabled]: disabled,
  });

  return (
    <label className={clsx(styles.root, styles[labelPosition], className)} title={title}>
      {children}
      <span className={textClasses} key='text'>
        {label}
      </span>
    </label>
  );
};

CheckableLabel.displayName = 'CheckableLabel';
