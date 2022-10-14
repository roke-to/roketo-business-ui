/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import React from 'react';

import styles from './dropdown-item.module.css';

export interface IDropdownItemProps extends React.HTMLAttributes<HTMLLIElement> {
  isActive?: boolean;
}

export const DropdownItem: React.FC<IDropdownItemProps> = ({children, isActive, onClick}) => (
  <li
    className={clsx(styles.contentItem, styles.disableListType, {
      [styles.active]: isActive,
    })}
    onClick={onClick}
  >
    {children}
  </li>
);
