import React from 'react';
import {Range as BaseRange} from 'react-range';

import {Thumb} from './thumb';
import {Track} from './track';

export interface RangeProps {
  value: number;
  onChange(value: number): void;
}

export const Range = ({value, onChange}: RangeProps) => {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <BaseRange
      step={1}
      min={0}
      max={100}
      values={[value]}
      onChange={handleChange}
      renderTrack={({props, children}) => (
        <Track {...props} value={value}>
          {children}
        </Track>
      )}
      renderThumb={({props}) => <Thumb {...props} />}
    />
  );
};
