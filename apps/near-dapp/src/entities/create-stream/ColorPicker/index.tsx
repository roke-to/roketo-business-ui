import type {FormikState} from 'formik';
import React, {ReactNode, useState} from 'react';

import {ColorDot} from '@roketo/core/kit/ColorDot';
import {DropdownMenu} from '@roketo/core/kit/DropdownMenu';
import {DropdownOpener} from '@roketo/core/kit/DropdownOpener';
import {FormField} from '@roketo/core/roketo-ui/components/FormField';

import {colorDescriptions, StreamColor, streamColors} from '../constants';
import styles from './styles.module.scss';

function ColorOption({color}: {color: StreamColor}) {
  const description = colorDescriptions[color];
  return (
    <>
      <ColorDot color={description.color} size={20} />
      <span>{description.label}</span>
    </>
  );
}

function Option({color, onClick}: {color: StreamColor; onClick: (color: StreamColor) => void}) {
  return (
    <button onClick={() => onClick(color)} type='button' className={styles.pickerOption}>
      <ColorOption color={color} />
    </button>
  );
}

export function ColorPicker({
  form,
  className,
  label,
  onChoose,
}: {
  form: FormikState<{color: StreamColor}>;
  className?: string;
  label: ReactNode;
  onChoose: (color: StreamColor) => void;
}) {
  const [opened, setDropdownOpened] = useState(false);
  return (
    <FormField isRequired={false} className={className} label={label} error={form.errors.color}>
      <div className={styles.dropdownWrapper}>
        <DropdownOpener
          onChange={setDropdownOpened}
          className={styles.dropdownOpener}
          opened={opened}
        >
          <ColorOption color={form.values.color} />
        </DropdownOpener>
        <DropdownMenu
          opened={opened}
          onClose={() => setDropdownOpened(false)}
          className={styles.dropdownMenu}
        >
          {streamColors.map((color) => (
            <Option
              color={color}
              key={color}
              onClick={() => {
                setDropdownOpened(false);
                onChoose(color);
              }}
            />
          ))}
        </DropdownMenu>
      </div>
    </FormField>
  );
}
