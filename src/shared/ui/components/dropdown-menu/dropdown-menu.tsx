import clsx from 'clsx';
import React, {useState} from 'react';

import {ReactComponent as ArrowDown} from '~/shared/ui/icons/arrow-down.svg';

import styles from './dropdown-menu.module.css';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  values: string[];
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({children, className, values}, ref) => {
    const [isVisible, setVisible] = useState(false);

    const handleVisible = () => {
      setVisible(!isVisible);
    };

    const selectedValue = values[0];

    return (
      <div ref={ref} className={clsx(styles.root, className)}>
        {children}
        {selectedValue}
        <ArrowDown onClick={handleVisible} className='ml-1' />
        <div
          className={clsx(styles.list, {
            [styles.visible]: isVisible,
          })}
        >
          {values.map((value) => (
            <div>{value}</div>
          ))}
        </div>
      </div>
    );
  },
);
