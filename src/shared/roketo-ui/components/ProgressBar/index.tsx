import clsx from 'clsx';
import React, {memo} from 'react';

import type {StreamDirection} from '~/shared/api/roketo/constants';
import {getRoundedPercentageRatio} from '~/shared/lib/roketo/math';

import styles from './styles.module.scss';

type Props = {
  total: string;
  streamed: string;
  withdrawn: string;
  cliffPercent?: number | null;
  withBigCliffMark?: boolean;
  direction?: StreamDirection | null;
  children?: React.ReactNode;

  className?: string;
};

export const ProgressBar = memo(
  ({
    total,
    streamed,
    withdrawn,
    className,
    cliffPercent,
    withBigCliffMark = false,
    direction,
    children,
  }: Props) => {
    const streamedToTotalPercentageRatio = getRoundedPercentageRatio(streamed, total);
    const withdrawnToTotalPercentageRatio = getRoundedPercentageRatio(withdrawn, total);

    return (
      <div
        className={clsx(styles.progressBar, className)}
        data-direction={direction}
        style={
          {
            '--cliff-percent': Math.min(cliffPercent ?? 0, 100),
            '--streamed-percents': streamedToTotalPercentageRatio.toString(),
            '--withdrawn-percents': withdrawnToTotalPercentageRatio.toString(),
          } as any
        }
      >
        <div className={styles.barCut}>
          <div className={clsx(styles.progress, styles.streamed)} />
          <div className={clsx(styles.progress, styles.withdrawn)} />
          {children}
        </div>
        {typeof cliffPercent === 'number' && (
          <>
            <div title='Cliff' className={styles.cliffMarkContainer}>
              <div className={clsx(styles.cliffMark, withBigCliffMark && styles.cliffMarkBig)} />
            </div>
            <div title='Cliff' className={styles.cliffMarkContainer}>
              <div className={clsx(styles.cliffMark, withBigCliffMark && styles.cliffMarkBig)} />
            </div>
          </>
        )}
      </div>
    );
  },
);
