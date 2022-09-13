import clsx from 'clsx';
import React from 'react';

import {Button, ButtonSize, ButtonVariant} from '~/shared/ui/components/button';
import {IgnoreItems} from '~/shared/ui/components/dropdown/overlay';
import {ReactComponent as ArrowDown} from '~/shared/ui/icons/arrow-down.svg';

import {Dropdown} from '../dropdown/dropdown';
import styles from './dropdown-menu.module.css';

export type DropdownMenuRootElementSize = ButtonSize;

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string | null;
  size?: DropdownMenuRootElementSize;
  variant?: ButtonVariant;
  getIgnoreItems?: () => IgnoreItems[];
  children: React.ReactElement;
  onClick?(): void;
  classNameMenuLabel?: string;
}

export const DropdownMenu = React.forwardRef<HTMLButtonElement, DropdownMenuProps>(
  (
    {
      label,
      size = 'md',
      variant = 'plain',
      onClick,
      getIgnoreItems,
      classNameMenuLabel,
      className,
      children,
      ...props
    },
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
          <div className={clsx(styles.menuLabel, classNameMenuLabel)}>{label}</div>
          <ArrowDown className={styles.icon} />
        </Button>
      }
      getIgnoreItems={getIgnoreItems}
    >
      {children}
    </Dropdown>
  ),
);

DropdownMenu.displayName = 'DropdownMenu';
