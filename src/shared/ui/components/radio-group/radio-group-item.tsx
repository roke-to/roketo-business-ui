import React, {useContext} from 'react';

import {ICheckableRootProps} from '../checkable-root';
import {Radio} from '../radio';
import {IRadioGroupContext, RadioGroupContext} from './radio-group-context';

interface IRadioCoreProps extends Omit<ICheckableRootProps, 'type'> {
  value: string;
  name?: string;
  checked?: boolean;
  radioGroup?: Partial<IRadioGroupContext>;
}

export type IRadioProps = Omit<IRadioCoreProps, 'radioGroup'>;

export const RadioGroupItem = React.forwardRef<HTMLInputElement, IRadioProps>(
  ({checked, name, value, ...props}, ref) => {
    let calcChecked = checked;
    let calcName = name;

    const radioGroup = useContext(RadioGroupContext);

    if (typeof checked === 'undefined') {
      calcChecked = radioGroup.value === value;
    }
    if (typeof name === 'undefined') {
      calcName = radioGroup.name;
    }

    return (
      <Radio
        {...props}
        ref={ref}
        checked={calcChecked}
        name={calcName}
        value={value}
        onChange={radioGroup.onChange}
      />
    );
  },
);
