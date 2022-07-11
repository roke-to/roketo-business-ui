import * as React from 'react';
import clsx from 'clsx';

import styles from './chip.module.css';

export interface IChipProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Chip: React.FC<IChipProps> = ({className, children, ...props}) => {
  const resultClassName = clsx(styles.chip, className);

  return (
    <div className={resultClassName} {...props}>
      {children}
    </div>
  );
};
