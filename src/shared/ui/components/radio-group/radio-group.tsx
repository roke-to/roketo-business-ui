import clsx from 'clsx';
import React, {useMemo} from 'react';

import {RadioGroupContext} from './radio-group-context';
import styles from './radio-group.module.css';

export type RadioGroupGap = 'sm' | 'md' | 'lg' | 'xl';

export interface IRadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  gap?: RadioGroupGap | number;
}

export const RadioGroup: React.FC<IRadioGroupProps> = ({
  name,
  value,
  gap = 3,
  className,
  onChange,
  children,
}) => {
  const contextProps = useMemo(() => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return {
      name,
      onChange: handleChange,
      value,
    };
  }, [name, onChange, value]);

  return (
    <RadioGroupContext.Provider value={contextProps}>
      <div className={clsx(styles.root, `gap-${gap}`, className)}>{children}</div>
    </RadioGroupContext.Provider>
  );
};
