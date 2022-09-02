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
}

export const DropdownMenu = React.forwardRef<HTMLButtonElement, DropdownMenuProps>(
  (
    {label, size = 'md', variant = 'plain', onClick, getIgnoreItems, className, children, ...props},
    ref,
  ) => (
    <Dropdown
      onClick={onClick}
      target={
        <Button variant={variant} size={size} className={className} {...props} ref={ref}>
          <div className={styles.menuLabel}>
            {label}
            <ArrowDown className={styles.icon} />
          </div>
        </Button>
      }
      getIgnoreItems={getIgnoreItems}
    >
      {children}
    </Dropdown>
  ),
);

DropdownMenu.displayName = 'DropdownMenu';
