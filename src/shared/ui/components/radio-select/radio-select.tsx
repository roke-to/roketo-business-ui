import React from 'react';

import {PartVisibleList} from '~/shared/ui/components/part-visible-list/part-visible-list';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';

import styles from './radio-select.module.css';

export interface RadioSelectProps {
  options: Array<{label: string; value: string}>;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxVisibleCount?: number;
  showAllText: string;
}

const renderOptions = (option: {label: string; value: string}) => (
  <RadioGroupItem key={option.value} value={option.value} label={option.label} />
);

export const RadioSelect = ({
  options,
  showAllText,
  name,
  value,
  onChange,
  maxVisibleCount = 5,
}: RadioSelectProps) => (
  <RadioGroup name={name} value={value} onChange={onChange} gap={1}>
    <PartVisibleList
      options={options}
      renderOptions={renderOptions}
      showAllText={showAllText}
      showAllClassName={styles.showAll}
      maxVisibleCount={maxVisibleCount}
    />
  </RadioGroup>
);
