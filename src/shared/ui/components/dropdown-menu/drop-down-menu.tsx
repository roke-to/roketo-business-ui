import clsx from 'clsx';
import React, {useState} from 'react';

import {Button, ButtonSize, ButtonVariant} from '~/shared/ui/components/button';
import {Overlay} from '~/shared/ui/components/overlay';
import {ReactComponent as ArrowDown} from '~/shared/ui/icons/arrow-down.svg';

import styles from './dropdown-menu.module.css';

export type DropDownMenuRootElementSize = ButtonSize;

export interface DropDownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  contentRef: React.RefObject<HTMLElement>;
  withOverlay?: boolean;
  size?: DropDownMenuRootElementSize;
  variant?: ButtonVariant;
}

export const DropDownMenu = React.forwardRef<HTMLDivElement, DropDownMenuProps>(
  (
    {label, contentRef, size = 'md', variant = 'plain', withOverlay = true, className, children},
    ref,
  ) => {
    const [isOpen, setOpen] = useState(false);

    const onChangeIsOpen = () => {
      setOpen(!isOpen);
    };

    const onClose = () => {
      setOpen(false);
    };

    const getItemsToIgnore = () => [contentRef?.current];

    const content = withOverlay ? (
      <Overlay onClose={onClose} getItemsToIgnore={getItemsToIgnore}>
        {children}
      </Overlay>
    ) : (
      children
    );

    return (
      <div ref={ref} className={clsx(styles.root, className)}>
        <Button variant={variant} size={size} onClick={onChangeIsOpen}>
          <div className={styles.menuLabel}>
            {label}
            <ArrowDown className={styles.icon} />
          </div>
        </Button>
        {isOpen && content}
      </div>
    );
  },
);
