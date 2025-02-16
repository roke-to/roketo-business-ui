import clsx from 'clsx';
import React from 'react';

import {ReactComponent as ArrowDown} from '../../icons/arrow-down.svg';
import {Button, ButtonSize, ButtonVariant} from '../button';
import {Dropdown} from '../dropdown/dropdown';
import {IgnoreItems} from '../dropdown/overlay';
import styles from './dropdown-menu.module.css';

export type DropdownMenuRootElementSize = ButtonSize;

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string | null;
  size?: DropdownMenuRootElementSize;
  variant?: ButtonVariant;
  getIgnoreItems?: () => IgnoreItems[];
  children: React.ReactElement;
  onClick?(): void;
}

export const DropdownMenu = React.forwardRef<HTMLButtonElement, DropdownMenuProps>(
  (
    {label, size = 'md', variant = 'plain', onClick, getIgnoreItems, className, children, ...props},
    ref,
  ) => (
    <Dropdown
      onClick={onClick}
      target={
        <Button
          variant={variant}
          size={size}
          className={clsx(className, styles.button)}
          {...props}
          ref={ref}
        >
          <span className={styles.menuLabel}>{label}</span>
          <ArrowDown className={styles.icon} />
        </Button>
      }
      getIgnoreItems={getIgnoreItems}
      className={styles.dropdown}
    >
      {children}
    </Dropdown>
  ),
);

DropdownMenu.displayName = 'DropdownMenu';
