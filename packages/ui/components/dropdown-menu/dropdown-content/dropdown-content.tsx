import clsx from 'clsx';
import React from 'react';

import {DropdownMenuRootElementSize} from 'ui/components/dropdown-menu';
import {DropdownItem, IDropdownItemProps} from 'ui/components/dropdown-menu/dropdown-item';

import styles from './dropdown-content.module.css';

const isDropdownItemOrSubMenu = (
  child: React.ReactNode,
): child is React.ReactElement<IDropdownItemProps> => {
  const type = (child as React.ReactElement)?.type;
  return type === DropdownItem;
};

export type DropdownContentDirection = 'start' | 'end';
export type DropdownContentGap = 'sm' | 'md' | 'lg' | 'xl';
export type DropdownContentOffset = 'xs' | 's' | 'm' | 'l';

export interface IDropdownContentProps extends React.HTMLAttributes<HTMLUListElement> {
  selected: number | string;
  handleChange: (n: number) => void;
  size?: DropdownMenuRootElementSize;
  direction?: DropdownContentDirection;
  gap?: DropdownContentGap | number;
  offset?: DropdownContentOffset;
}

export const DropdownContent = React.forwardRef<HTMLUListElement, IDropdownContentProps>(
  (
    {
      selected,
      handleChange,
      size = 'md',
      direction = 'start',
      gap = 0,
      offset = '',
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <ul
      {...props}
      ref={ref}
      className={clsx(
        styles.contentBlock,
        styles[size],
        styles[direction],
        styles[`offset_${offset}`],
        gap && `gap-${gap}`,
        className,
      )}
    >
      {React.Children.map(children, (child, id) => {
        const isActive = id === selected;
        if (isDropdownItemOrSubMenu(child)) {
          return React.cloneElement(child, {
            ...child.props,
            isActive,
            onClick: () => handleChange(id),
          });
        }
        return child;
      })}
    </ul>
  ),
);

DropdownContent.displayName = 'DropdownContent';
