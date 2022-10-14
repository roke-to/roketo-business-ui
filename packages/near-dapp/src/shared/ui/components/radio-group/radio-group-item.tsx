import React, {useContext} from 'react';

import {CheckableLabel, CheckableLabelPosition} from '~/shared/ui/components/checkable-label';

import {ICheckableRootProps} from '../checkable-root';
import {Radio} from '../radio';
import {IRadioGroupContext, RadioGroupContext} from './radio-group-context';

interface IRadioCoreProps extends Omit<ICheckableRootProps, 'type'> {
  value: string;
  name?: string;
  label?: string;
  labelPosition?: CheckableLabelPosition;
  checked?: boolean;
  radioGroup?: Partial<IRadioGroupContext>;
}

export type IRadioProps = Omit<IRadioCoreProps, 'radioGroup'>;

export const RadioGroupItem = React.forwardRef<HTMLInputElement, IRadioProps>(
  ({checked, name, value, label, ...props}, ref) => {
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
      <CheckableLabel label={label}>
        <Radio
          {...props}
          ref={ref}
          checked={calcChecked}
          name={calcName}
          value={value}
          onChange={radioGroup.onChange}
        />
      </CheckableLabel>
    );
  },
);

RadioGroupItem.displayName = 'RadioGroupItem';
