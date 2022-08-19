import clsx from 'clsx';
import {format, isValid, parse} from 'date-fns';
import React, {useState} from 'react';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {usePopper} from 'react-popper';

import {IconButton} from '~/shared/ui/components/icon-button';
import {Input, InputProps} from '~/shared/ui/components/input';
import {ReactComponent as CalendarIcon} from '~/shared/ui/icons/calendar.svg';

import {Popover, Transition} from '@headlessui/react';

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

  // todo: не знаю почему, но если юзать useRef, поппер начинает глючить при ините
  // из-за этого пришлось отключить TS при прокидывании рефов
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const {styles: popperStyles, attributes: popperAttributes} = usePopper(
    referenceElement,
    popperElement,
  );

  return (
    <Popover className={clsx(styles.wrapper)}>
      <Input
        className={clsx(styles.input, className)}
        value={value}
        onChange={onChange}
        {...props}
      />
      {/* @ts-ignore */}
      <Popover.Button as='div' className={clsx(styles.icon)} ref={setReferenceElement}>
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
          // @ts-ignore
          ref={setPopperElement}
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
