import React from 'react';

import {Button} from '~/shared/ui/components/button';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';

import styles from './radio-select.module.css';

export interface RadioSelectProps {
  options: Array<{label: string; value: string}>;
  value?: string;
  onChange?: (value: string) => void;
  maxVisibleCount?: number;
  showAllText: string;
}

export const RadioSelect = ({
  options,
  showAllText,
  value,
  onChange,
  maxVisibleCount = 5,
}: RadioSelectProps) => {
  const [isAllVisible, setIsAllVisible] = React.useState(false);

  const visibleOptions = isAllVisible ? options : options.slice(0, maxVisibleCount);

  return (
    <RadioGroup name='daoId' value={value} onChange={onChange} gap={1}>
      {visibleOptions.map((option) => (
        <RadioGroupItem key={option.value} value={option.value} label={option.label} />
      ))}
      {visibleOptions.length !== options.length && options.length > maxVisibleCount ? (
        <Button variant='clean' className={styles.showAll} onClick={() => setIsAllVisible(true)}>
          {showAllText}
        </Button>
      ) : null}
    </RadioGroup>
  );
};
