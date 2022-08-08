import clsx from 'clsx';
import React from 'react';

import styles from './checkable-label.module.css';

type IContent = string | React.ReactElement;

export type CheckableLabelPosition = 'left' | 'right';

export interface ICheckableLabelProps {
  label?: IContent;
  labelPosition?: CheckableLabelPosition;
  disabled?: boolean;
  className?: string;
}

export const CheckableLabel: React.FC<ICheckableLabelProps> = ({
  children,
  label,
  labelPosition = 'left',
  className,
  disabled,
}) => {
  const textClasses = clsx({
    [styles.disabled]: disabled,
  });

  return (
    <label className={clsx(styles.root, styles[labelPosition], className)}>
      {children}
      <span className={textClasses} key='text'>
        {label}
      </span>
    </label>
  );
};

CheckableLabel.displayName = 'CheckableLabel';
