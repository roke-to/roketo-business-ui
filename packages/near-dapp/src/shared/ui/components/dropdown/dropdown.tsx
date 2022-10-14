import clsx from 'clsx';
import React, {useState} from 'react';

import styles from './dropdown.module.css';
import {IgnoreItems, Overlay} from './overlay';

export interface DropdownProps {
  target: React.ReactElement;
  getIgnoreItems?: () => IgnoreItems[];
  children: React.ReactElement;
  className?: string;
  onClick?(): void;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({target, getIgnoreItems, onClick, children, className}, ref) => {
    const contentRef = React.useRef<HTMLElement>(null);
    const targetRef = React.useRef<HTMLElement>(null);
    const [isOpen, setOpen] = useState(false);

    const onChangeIsOpen = React.useCallback(() => {
      if (onClick) {
        onClick();
      } else {
        setOpen((currentIsOpen) => !currentIsOpen);
      }
    }, [onClick]);

    const onClose = () => {
      setOpen(false);
    };

    const getItemsToIgnore = () => [
      contentRef?.current,
      targetRef?.current,
      ...(getIgnoreItems?.() || []),
    ];

    const targetElement = React.cloneElement(target, {
      ...target.props,
      onClick: onChangeIsOpen,
      ref: targetRef,
    });
    const contentElement = React.cloneElement(children, {ref: contentRef});

    return (
      <div ref={ref} className={clsx(styles.root, className)}>
        {targetElement}
        {isOpen && (
          <Overlay onClose={onClose} getItemsToIgnore={getItemsToIgnore}>
            {contentElement}
          </Overlay>
        )}
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
