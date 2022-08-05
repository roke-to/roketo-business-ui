import clsx from 'clsx';
import React, {PropsWithChildren, useMemo} from 'react';

import {RadioGroupContext} from './radio-group-context';
import styles from './radio-group.module.css';

export type RadioGroupGap = 'sm' | 'md' | 'lg' | 'xl';

export interface IRadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  gap?: RadioGroupGap | number;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, PropsWithChildren<IRadioGroupProps>>(
  ({name, value, gap = 0, className, onChange, children}, ref) => {
    const contextProps = useMemo(() => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
      };

      return {
        name,
        onChange: handleChange,
        value,
      };
    }, [name, onChange, value]);

    return (
      <RadioGroupContext.Provider value={contextProps}>
        <div ref={ref} className={clsx(styles.root, gap && `gap-${gap}`, className)}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
