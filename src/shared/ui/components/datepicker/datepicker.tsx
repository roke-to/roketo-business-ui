import clsx from 'clsx';
import {format, isValid, parse} from 'date-fns';
import React from 'react';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {usePopper} from 'react-popper';

import {IconButton} from '~/shared/ui/components/icon-button';
import {Input, InputProps} from '~/shared/ui/components/input';
import {ReactComponent as CalendarIcon} from '~/shared/ui/icons/calendar.svg';

import {Popover, Transition} from '@headlessui/react';

import styles from './datepicker.module.css';

// @ts-expect-err temp
interface DatepickerProps extends InputProps {
  className?: string;
  name?: string;
  value?: string;
  onChange: (value: string) => void;
  formatString?: string;
}

export const Datepicker: React.FC<DatepickerProps> = ({
  className,
  value = '',
  onChange,
  formatString = 'dd/MM/yyyy',
  ...props
}) => {
  const date = parse(value, formatString, new Date());
  const selected = isValid(date) ? date : undefined;

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onChange(format(newDate, formatString));
    } else {
      onChange('');
    }
  };

  const refPopoverButton = React.createRef<HTMLDivElement>();
  const refPopoverPanel = React.createRef<HTMLDivElement>();
  const {styles: popperStyles, attributes: popperAttributes} = usePopper(
    refPopoverButton.current,
    refPopoverPanel.current,
  );

  return (
    <Popover className={clsx(styles.wrapper)}>
      <Input
        className={clsx(styles.input, className)}
        value={value}
        onChange={onChange}
        {...props}
      />
      <Popover.Button as='div' className={clsx(styles.icon)} ref={refPopoverButton}>
        <IconButton variant='clean' size='sm'>
          <CalendarIcon />
        </IconButton>
      </Popover.Button>

      <Transition
        enter='transition duration-200 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-200 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Popover.Panel
          ref={refPopoverPanel}
          className={clsx(styles.panel)}
          style={popperStyles.popper}
          {...popperAttributes.popper}
        >
          <DayPicker
            mode='single'
            selected={selected}
            onSelect={handleDateSelect}
            weekStartsOn={1}
          />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
