import React, {useMemo} from 'react';

import {RadioGroupContext} from './radio-group-context';

export interface IRadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<IRadioGroupProps> = ({
  name,
  value,
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
      <div className={className}>{children}</div>
    </RadioGroupContext.Provider>
  );
};
