import React from 'react';
import {Merge} from 'type-fest';

import {Dropdown} from '~/shared/ui/components/dropdown';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Input} from '~/shared/ui/components/input';

export type InputVariant = 'outlined';

export type InputSize = 'md';

type Option = {
  label: string;
  value: string;
};

// Prefer extends, but override with Omit<..., 'size'> is clumsy
type InputProps = Merge<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: InputVariant;
    size?: InputSize;
    options: Array<Option>;
    onChange: (value: any) => void;
  }
>;

export const InputDropdown: React.FC<InputProps> = ({
  value,
  children,
  className,
  options,
  onChange,
  ...props
}) => {
  const handleChange = React.useCallback(
    (index) => {
      onChange(options[index].value);
    },
    [onChange, options],
  );

  return (
    <Dropdown
      target={<Input {...props} readOnly value={options.find((o) => o.value === value)?.label} />}
    >
      <DropdownContent
        selected={options.findIndex((o) => o.value === value)}
        handleChange={handleChange}
        direction='start'
        offset='m'
        gap={3}
      >
        {options.map(({label}) => (
          <DropdownItem key={label}>{label}</DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};
