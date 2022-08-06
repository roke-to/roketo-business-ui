import clsx from 'clsx';
import React from 'react';
import {ITrackProps} from 'react-range/lib/types';

import styles from './track.module.css';

export interface TrackProps extends Partial<ITrackProps> {
  value: number;
  children?: React.ReactNode;
  className?: string;
  scaleContainer?: string;
  rightPartClassName?: string;
  leftPartClassName?: string;
}

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  (
    {value: left, children, className, scaleContainer, rightPartClassName, leftPartClassName},
    ref,
  ) => {
    const right = 100 - left;
    return (
      <div className={clsx(styles.root, className)} ref={ref}>
        <div className={clsx(styles.scaleContainer, scaleContainer)}>
          <div style={{width: `${left}%`}} className={clsx(styles.rightPart, rightPartClassName)} />
          <div style={{width: `${right}%`}} className={clsx(styles.leftPart, leftPartClassName)} />
        </div>
        {children}
      </div>
    );
  },
);
