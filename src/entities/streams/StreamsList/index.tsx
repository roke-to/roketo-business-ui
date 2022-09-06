import clsx from 'clsx';
import {useList, useStore, useStoreMap} from 'effector-react';
import React, {memo} from 'react';
import {Link} from 'react-router-dom';

import {EmptyProposalList} from '~/entities/proposal/ui/empty-proposal-list';
import {StreamListControls} from '~/entities/stream-control/StreamControls';
import type {STREAM_STATUS} from '~/shared/api/roketo/constants';
import {getStreamLink} from '~/shared/config/routes';
import {testIds} from '~/shared/constants';
import {ColorDot} from '~/shared/kit/ColorDot';
import {Badge} from '~/shared/roketo-ui/Badge';
import {CopyLinkButton} from '~/shared/roketo-ui/components/CopyLinkButton';
import {ProgressBar} from '~/shared/roketo-ui/components/ProgressBar';
import {Spinner} from '~/shared/roketo-ui/components/Spinner';
import clockIcon from '~/shared/roketo-ui/icons/clock.svg';

import type {RoketoStream} from '@roketo/sdk/dist/types';

import {streamCardDataDefaults, streamProgressDataDefaults} from '../constants';
import {CreateStreamProposalButton} from '../create-stream-proposal-button';
import {
  $filteredStreams,
  $selectedStream,
  $streamCardsData,
  $streamListData,
  $streamsProgress,
} from '../model';
import {StreamProgress} from '../StreamProgress';
import activeStreamIcon from './activeStream.svg';
import finishedStreamIcon from './finishedStream.svg';
import menuDotsIcon from './menuDots.svg';
import pausedStreamIcon from './pausedStream.svg';
import styles from './styles.module.scss';

const StreamNameLink = memo(({streamId}: {streamId: string}) => {
  const {streamPageLink, name, isLocked} = useStoreMap({
    store: $streamCardsData,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamCardDataDefaults,
  });
  return (
    <Link to={streamPageLink} className={clsx(styles.nameCell)}>
      <span className={styles.nameText}>{name}</span>

      {isLocked && (
        <Badge className={styles.inlineBadge} isOrange>
          Locked
        </Badge>
      )}
    </Link>
  );
});

const ViewDetailsLink = memo(({to}: {to: string}) => (
  <Link to={to} className={styles.viewDetails}>
    View details
  </Link>
));

const StreamCommentLink = memo(({streamId}: {streamId: string}) => {
  const {streamPageLink, comment} = useStoreMap({
    store: $streamCardsData,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamCardDataDefaults,
  });
  return (
    <Link to={streamPageLink} className={clsx(styles.commentCell)}>
      <div className={styles.commentBlock}>{comment}</div>
    </Link>
  );
});

function selectIcon(iconType: keyof typeof STREAM_STATUS) {
  switch (iconType) {
    case 'Active':
      return activeStreamIcon;
    case 'Finished':
      return finishedStreamIcon;
    case 'Initialized':
    case 'Paused':
    default:
      return pausedStreamIcon;
  }
}

const CollapsedStreamRow = ({stream}: {stream: RoketoStream}) => {
  const {id: streamId} = stream;
  const {
    color,
    showAddFundsButton,
    showWithdrawButton,
    showStartButton,
    showPauseButton,
    iconType,
  } = useStoreMap({
    store: $streamCardsData,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamCardDataDefaults,
  });
  return (
    <>
      <div className={styles.colorCell} style={{'--stream-color': color} as any} />
      <div className={clsx(styles.statusCell)}>
        <img
          src={selectIcon(iconType)}
          alt={iconType}
          className={styles.streamStatusIcon}
          data-testid={testIds.streamStatusIcon}
        />
      </div>

      <StreamProgress
        streamId={stream.id}
        className={clsx(styles.progressCell, styles.leftStickyCell)}
      />

      <StreamNameLink streamId={stream.id} />

      <StreamCommentLink streamId={stream.id} />

      <div className={clsx(styles.controlCell)}>
        <CopyLinkButton className={styles.streamLinkButton} link={getStreamLink(streamId)} />
        <StreamListControls
          stream={stream}
          dropdownClassName={styles.controlDropdown}
          showAddFundsButton={showAddFundsButton}
          showWithdrawButton={showWithdrawButton}
          showStartButton={showStartButton}
          showPauseButton={showPauseButton}
          openerClassName={styles.streamActionsButton}
          openerContent={
            <img
              src={menuDotsIcon}
              alt='Open stream actions'
              className={styles.streamActionsIcon}
            />
          }
        />
      </div>
    </>
  );
};

const ExpandedStreamCard = ({stream}: {stream: RoketoStream}) => {
  const {id: streamId} = stream;
  const {
    color,
    iconType,
    comment,
    streamPageLink,
    showAddFundsButton,
    showWithdrawButton,
    showStartButton,
    showPauseButton,
  } = useStoreMap({
    store: $streamCardsData,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamCardDataDefaults,
  });
  const {
    name,
    totalText,
    symbol,
    progressFull,
    progressStreamed,
    progressWithdrawn,
    cliffPercent,
    cliffText,
    speedFormattedValue,
    speedUnit,
    timeLeft,
    streamedText,
    streamedPercentage,
    withdrawnText,
    withdrawnPercentage,
    direction,
    sign,
  } = useStoreMap({
    store: $streamsProgress,
    keys: [streamId],
    fn: (items) => items[streamId],
    defaultValue: streamProgressDataDefaults,
  });
  return (
    <div className={styles.expandedInfo}>
      <div className={clsx(styles.statusIcon)}>
        <img src={selectIcon(iconType)} alt='Stream status' />
      </div>
      <ProgressBar
        total={progressFull}
        streamed={progressStreamed}
        withdrawn={progressWithdrawn}
        cliffPercent={cliffPercent}
        direction={direction}
        className={styles.progressBar}
      >
        <div className={styles.barStatusText}>
          <span className={styles.barStreamName}>{name}</span>
          <div className={styles.barProgressText}>
            {sign}
            {streamedText} of {totalText} <span className={styles.subtext}>{symbol}</span>
          </div>
        </div>
      </ProgressBar>
      {color && <ColorDot className={styles.color} color={color} />}
      <div className={styles.direction}>{direction === 'in' ? 'Incoming' : 'Outgoing'} stream</div>
      <CopyLinkButton className={styles.link} link={getStreamLink(streamId)} />
      <div className={styles.speed}>
        {speedFormattedValue}{' '}
        <span className={styles.subtext}>
          {symbol} / {speedUnit}
        </span>
      </div>
      {timeLeft && (
        <>
          <img src={clockIcon} alt='remaining' className={styles.remainingIcon} />
          <div className={styles.remaining}>{timeLeft} remaining</div>
        </>
      )}
      <div className={styles.streamed}>
        Streamed: {streamedText}{' '}
        <span className={styles.subtext}>({streamedPercentage.toString()}%)</span>
      </div>
      <div className={styles.withdrawn}>
        Withdrawn: {withdrawnText}{' '}
        <span className={styles.subtext}>({withdrawnPercentage.toString()}%)</span>
      </div>
      {cliffText && <div className={styles.cliffRemaining}>Cliff ends within: {cliffText}</div>}
      {comment && <div className={styles.comment}>{comment}</div>}
      <StreamListControls
        stream={stream}
        dropdownClassName={styles.controlDropdown}
        needToUseBlur
        showAddFundsButton={showAddFundsButton}
        showWithdrawButton={showWithdrawButton}
        showStartButton={showStartButton}
        showPauseButton={showPauseButton}
        className={styles.streamActions}
        openerClassName={styles.streamActionsButtonExpanded}
        openerContent='Stream actions'
      />
      <ViewDetailsLink to={streamPageLink} />
    </div>
  );
};

const Placeholder = () => {
  const {streamsLoading, hasStreams} = useStore($streamListData);
  if (streamsLoading) return <Spinner wrapperClassName={styles.loader} />;
  if (!hasStreams) {
    return (
      <EmptyProposalList
        createProposalComponent={<CreateStreamProposalButton className='mx-auto' />}
        isDefaultFiltersValue
      />
    );
  }
  return <div>No streams matching your filters. Try selecting different ones</div>;
};

const StreamRow = (stream: RoketoStream) => {
  const {id: streamId} = stream;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isSelected = useStoreMap({
    store: $selectedStream,
    keys: [streamId],
    fn: (selected) => selected === streamId,
  });
  return isSelected ? (
    <ExpandedStreamCard stream={stream} />
  ) : (
    <CollapsedStreamRow stream={stream} />
  );
};

export const StreamsList = ({className}: {className?: string}) => {
  const filteredStreams = useStore($filteredStreams);
  return (
    <div className={clsx(styles.container, className)}>
      <section className={styles.streamGrid}>
        {filteredStreams.length !== 0 && (
          <>
            <h3 className={clsx(styles.leftStickyCell, styles.title)}>Amount to stream</h3>
            <h3 className={styles.title}>Wallet address</h3>
            <h3 className={styles.title}>Comment</h3>
          </>
        )}

        {useList($filteredStreams, {
          getKey: ({id}) => id,
          fn: StreamRow,
          placeholder: (
            <div className={styles.emptyState}>
              <Placeholder />
            </div>
          ),
        })}
      </section>
    </div>
  );
};
