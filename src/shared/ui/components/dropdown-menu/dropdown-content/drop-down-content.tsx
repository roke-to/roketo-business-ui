import clsx from 'clsx';
import React from 'react';

import {DropDownMenuRootElementSize} from '~/shared/ui/components/dropdown-menu';
import {DropDownItem, IDropDownItemProps} from '~/shared/ui/components/dropdown-menu/dropdown-item';

import styles from './dropdown-content.module.css';

const isDropDownItemOrSubMenu = (
  child: React.ReactNode,
): child is React.ReactElement<IDropDownItemProps> => {
  const type = (child as React.ReactElement)?.type;
  return type === DropDownItem;
};

export type DropDownContentDirection = 'start' | 'end';
export type DropDownContentGap = 'sm' | 'md' | 'lg' | 'xl';
export type DropDownContentOffset = 'xs' | 's' | 'm' | 'l';

export interface IDropDownContentProps extends React.HTMLAttributes<HTMLUListElement> {
  selected: number;
  handleChange: (n: number) => void;
  size?: DropDownMenuRootElementSize;
  direction?: DropDownContentDirection;
  gap?: DropDownContentGap | number;
  offset?: DropDownContentOffset;
}

export const DropDownContent = React.forwardRef<HTMLUListElement, IDropDownContentProps>(
  (
    {selected, handleChange, size = 'md', direction = 'start', gap = 0, offset = '', children},
    ref,
  ) => (
    <ul
      ref={ref}
      className={clsx(
        styles.contentBlock,
        styles[size],
        styles[direction],
        styles[`offset_${offset}`],
        `gap-${gap}`,
      )}
    >
      {React.Children.map(children, (child, id) => {
        const isActive = id === selected;
        if (isDropDownItemOrSubMenu(child)) {
          return React.cloneElement(child, {
            ...child.props,
            isActive,
            onClick: () => handleChange(id),
          });
        }
        return null;
      })}
    </ul>
  ),
);
