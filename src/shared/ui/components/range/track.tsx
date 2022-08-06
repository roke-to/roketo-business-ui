import clsx from 'clsx';
import React from 'react';
import {ITrackProps} from 'react-range/lib/types';

import styles from './track.module.css';

export interface TrackProps extends Partial<ITrackProps> {
  value: number;
  children?: React.ReactNode;
  rightPartClassName?: string;
  leftPartClassName?: string;
}

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({value: left, children, rightPartClassName, leftPartClassName}, ref) => {
    const right = 100 - left;
    return (
      <div className={styles.scaleContainer} ref={ref}>
        <div
          style={{width: `${left}%`}}
          className={clsx(styles.positive, {[styles.scaleFull]: left === 100}, rightPartClassName)}
        />
        <div
          style={{width: `${right}%`}}
          className={clsx(styles.negative, {[styles.scaleFull]: right === 100}, leftPartClassName)}
        />
        {children}
      </div>
    );
  },
);
