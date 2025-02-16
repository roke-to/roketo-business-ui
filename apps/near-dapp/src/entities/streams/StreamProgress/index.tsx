import clsx from 'clsx';
import {useStoreMap} from 'effector-react';
import RCTooltip from 'rc-tooltip';
import React from 'react';

import {testIds} from '~/shared/constants';
import {ProgressBar} from '~/shared/roketo-ui/ProgressBar';

import clockIcon from '@roketo/core/ui/icons/clock.svg';

import {streamProgressDataDefaults} from '../constants';
import {$streamsProgress, selectStream} from '../model';
import styles from './styles.module.scss';

const TOOLTIP_ALIGN = {
  points: ['tl', 'bc'],
  offset: [-24, 10],
};

const ExtendedInfo = ({streamId, className}: {streamId: string; className?: string}) => {
  const {
    totalText,
    symbol,
    progressFull,
    progressStreamed,
    progressWithdrawn,
    cliffPercent,
    speedFormattedValue,
    speedUnit,
    timeLeft,
    streamedText,
    streamedPercentage,
    withdrawnText,
    withdrawnPercentage,
    direction,
    sign,
    cliffText,
  } = useStoreMap({
    store: $streamsProgress,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamProgressDataDefaults,
  });
  return (
    <div className={clsx(styles.extendedInfo, styles.text, className)}>
      <div className={styles.title}>{direction === 'in' ? 'Ingoing' : 'Outgoing'} stream</div>
      <div className={styles.innerStatus}>
        <span>
          {streamedText} of {totalText}
        </span>{' '}
        <span className={styles.subtext}>{symbol}</span>
      </div>

      <ProgressBar
        total={progressFull}
        streamed={progressStreamed}
        withdrawn={progressWithdrawn}
        cliffPercent={cliffPercent}
        direction={direction}
      />

      <div className={clsx(styles.status, styles.speed)}>
        {sign}
        {speedFormattedValue}{' '}
        <span className={styles.subtext}>
          {symbol} / {speedUnit}
        </span>
      </div>

      {timeLeft && (
        <div className={styles.remaining}>
          <img src={clockIcon} className={styles.clock} alt='remaining' />
          {timeLeft}
        </div>
      )}

      {cliffText && <div className={clsx(styles.progress)}>Cliff ends within: {cliffText}</div>}

      <div className={clsx(styles.progress, styles.streamed)}>
        Streamed: {streamedText}{' '}
        <span className={styles.subtext}>{`(${streamedPercentage}%)`}</span>
      </div>

      <div className={clsx(styles.progress, styles.withdrawn)}>
        Withdrawn: {withdrawnText}{' '}
        <span className={styles.subtext}>{`(${withdrawnPercentage}%)`}</span>
      </div>
    </div>
  );
};

export const StreamProgress = ({streamId, className}: {streamId: string; className: string}) => {
  const {
    totalText,
    streamedText,
    symbol,
    sign,
    progressFull,
    progressStreamed,
    progressWithdrawn,
    cliffPercent,
    direction,
    name,
  } = useStoreMap({
    store: $streamsProgress,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamProgressDataDefaults,
  });
  return (
    <RCTooltip
      overlayClassName={styles.overlay}
      destroyTooltipOnHide
      align={TOOLTIP_ALIGN}
      placement='bottom'
      overlay={<ExtendedInfo streamId={streamId} className={styles.tooltip} />}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={clsx(styles.root, styles.text, className)}
        onClick={() => selectStream(streamId)}
      >
        <ProgressBar
          total={progressFull}
          streamed={progressStreamed}
          withdrawn={progressWithdrawn}
          cliffPercent={cliffPercent}
          direction={direction}
        >
          <div className={styles.status}>
            <span className={styles.streamName}>{name}</span>
            <div className={styles.progressStatus}>
              <span data-testid={testIds.streamProgressCaption}>
                {sign}
                {streamedText} of {totalText}
              </span>{' '}
              <span className={styles.tokenSymbol}>{symbol}</span>
            </div>
          </div>
        </ProgressBar>
      </div>
    </RCTooltip>
  );
};
