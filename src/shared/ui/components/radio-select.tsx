import React from 'react';

import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';
import {Typography} from '~/shared/ui/components/typography';

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
        <Typography
          as='button'
          font='muted'
          className='ml-7 w-min whitespace-nowrap text-gray hover:text-blue-textDefault hover:cursor-pointer transition-colors'
          onClick={() => setIsAllVisible(true)}
        >
          {showAllText}
        </Typography>
      ) : null}
    </RadioGroup>
  );
};
