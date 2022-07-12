import clsx from 'clsx';
import React from 'react';

import styles from './checkable-label.module.css';

type IContent = string | React.ReactElement;

export interface ICheckableLabelProps {
  left?: IContent;
  right?: IContent;
  disabled?: boolean;
  className?: string;
}

const renderText = (textClassName: string, content: IContent, disabled?: boolean) => {
  const textClasses = clsx(
    styles.text,
    {
      [styles.disabled]: disabled,
    },
    textClassName,
  );

  return (
    <span className={textClasses} key='text'>
      {content}
    </span>
  );
};

export const CheckableLabel: React.FC<ICheckableLabelProps> = ({
  children,
  left,
  right,
  className,
  disabled,
}) => (
  <label className={clsx(styles.root, className)}>
    {left && renderText(styles.left, left, disabled)}
    {children}
    {right && renderText(styles.right, right, disabled)}
  </label>
);
