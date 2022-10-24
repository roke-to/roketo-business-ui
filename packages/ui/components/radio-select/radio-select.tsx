import React from 'react';

import {PartVisibleList} from 'ui/components/part-visible-list';
import {RadioGroup, RadioGroupItem} from 'ui/components/radio-group';

import styles from './radio-select.module.css';

export interface RadioSelectProps {
  options: Array<{label: string; value: string}>;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxVisibleCount?: number;
  showAllText: string;
  showLessText: string;
}

const renderOptions = (option: {label: string; value: string}) => (
  <RadioGroupItem key={option.value} value={option.value} label={option.label} />
);

export const RadioSelect = ({
  options,
  showAllText,
  showLessText,
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
      showLessText={showLessText}
      showMoreClassName={styles.showAll}
      maxVisibleCount={maxVisibleCount}
    />
  </RadioGroup>
);
