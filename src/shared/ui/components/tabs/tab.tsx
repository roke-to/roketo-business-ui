import clsx from 'clsx';
import React from 'react';

import {Button} from '../button';
import {TabsContext} from './context';
import styles from './tab.module.css';

export interface ITabProps<T = any> {
  value: T;
  className?: string;
}

// ts-unused-exports:disable-next-line
export const Tab: React.FC<ITabProps> = ({children, value, ...props}) => {
  const {value: selected, onChange} = React.useContext(TabsContext);
  const handleClick = React.useCallback(() => onChange?.(value), [value, onChange]);

  return (
    <Button
      {...props}
      className={clsx({[styles.selected]: value === selected})}
      variant='clean'
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
