import clsx from 'clsx';
import React, {useState} from 'react';

import styles from './dropdown.module.css';
import {Overlay} from './overlay';

export interface DropdownProps {
  target: React.ReactElement;
  children: React.ReactElement;
  className?: string;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({target, children, className}, ref) => {
    const contentRef = React.useRef<HTMLElement>(null);
    const targetRef = React.useRef<HTMLElement>(null);
    const [isOpen, setOpen] = useState(false);

    const onChangeIsOpen = () => {
      setOpen((currentIsOpen) => !currentIsOpen);
    };

    const onClose = () => {
      setOpen(false);
    };

    const getItemsToIgnore = () => [contentRef?.current, targetRef?.current];

    const targetElement = React.cloneElement(target, {onClick: onChangeIsOpen, ref: targetRef});
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
