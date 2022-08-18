import clsx from 'clsx';
import {format, isValid, parse} from 'date-fns';
import React from 'react';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import {IconButton} from '~/shared/ui/components/icon-button';
import {Input, InputProps} from '~/shared/ui/components/input';
import {ReactComponent as CalendarIcon} from '~/shared/ui/icons/calendar.svg';

import {Popover} from '@headlessui/react';

import styles from './datepicker.module.css';

interface Props extends InputProps {
  value: string;
  onChange: (value: string) => void;
}

export const Datepicker: React.FC<Props> = ({className, value, onChange, ...props}) => {
  const date = parse(value, 'dd/MM/yyyy', new Date());
  const selected = isValid(date) ? date : undefined;

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onChange(format(newDate, 'dd/MM/yyyy'));
    } else {
      onChange('');
    }
  };

  return (
    <Popover>
      <Popover.Panel>
        <DayPicker mode='single' selected={selected} onSelect={handleDateSelect} weekStartsOn={1} />
      </Popover.Panel>

      <div className={clsx(styles.wrapper)}>
        <Input
          className={clsx(styles.input, className)}
          value={value}
          onChange={onChange}
          {...props}
        />

        <Popover.Button className={clsx(styles.icon)}>
          <IconButton variant='clean' size='sm'>
            <CalendarIcon />
          </IconButton>
        </Popover.Button>
      </div>
    </Popover>
  );
};
