import React from 'react';

import {Button, ButtonSize, ButtonVariant} from '~/shared/ui/components/button';
import {ReactComponent as ArrowDown} from '~/shared/ui/icons/arrow-down.svg';

import {Dropdown} from '../dropdown/dropdown';
import styles from './dropdown-menu.module.css';

export type DropdownMenuRootElementSize = ButtonSize;

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string | null;
  size?: DropdownMenuRootElementSize;
  variant?: ButtonVariant;
  children: React.ReactElement;
  onClick?(): void;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({label, size = 'md', variant = 'plain', onClick, className, children}, ref) => (
    <Dropdown
      ref={ref}
      className={className}
      onClick={onClick}
      target={
        <Button variant={variant} size={size}>
          <div className={styles.menuLabel}>
            {label}
            <ArrowDown className={styles.icon} />
          </div>
        </Button>
      }
    >
      {children}
    </Dropdown>
  ),
);
