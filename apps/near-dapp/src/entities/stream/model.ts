import {isPast} from 'date-fns';
import {createGate} from 'effector-react';

import {getStreamingSpeed} from '~/entities/create-stream/lib';
import {
  $currentDaoId,
  $priceOracle,
  $roketoWallet,
  $tokens,
  lastCreatedStreamUpdated,
} from '~/entities/wallet';
import {STREAM_STATUS, StreamDirection} from '~/shared/api/roketo/constants';
import {formatAmount, formatSmartly, toHumanReadableValue} from '~/shared/api/token-formatter';
import {getStreamLink} from '~/shared/config/routes';

import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
  split,
} from '@roketo/core/lib/effector';
import {createProtectedEffect} from '@roketo/core/roketo/protectedEffect';
import {
  ableToAddFunds,
  ableToPauseStream,
  ableToStartStream,
  calculateCliffEndTimestamp,
  calculateCliffPercent,
  calculateTimeLeft,
  formatTimeLeft,
  getAvailableToWithdraw,
  getStream,
  getStreamDirection,
  getStreamProgress,
  hasPassedCliff,
  isDead,
  isIdling,
  parseColor,
  parseComment,
} from '@roketo/sdk';
import type {RichToken, RoketoStream} from '@roketo/sdk/dist/types';

export const pageGate = createGate<string | null>({defaultState: null});
export const $stream = createStore<RoketoStream | null>(null);
export const $pageError = createStore<string | null>(null);
const requestStreamFx = createProtectedEffect({
  source: $roketoWallet,
  async fn({contract}, streamId: string | null) {
    return streamId && getStream({streamId, contract});
  },
});
export const $loading = combine($stream, $pageError, (stream, error) => !stream && !error);

const dataUpdated = createEvent<{
  stream: RoketoStream;
  token: RichToken;
}>();
const drawRetriggered = createEvent<{
  stream: RoketoStream;
  token: RichToken;
}>();
const noData = createEvent<unknown>();

export const $streamInfo = createStore({
  active: false,
  sender: '',
  receiver: '',
  amount: '',
  tokenSymbol: '',
  cliff: null as null | {title: string; value: string},
  remaining: '',
  tokensAvailable: '',
  progressText: '',
  progressInUSD: '',
  withdrawnText: '',
  cliffPercent: null as number | null,
  withdrawn: '',
  streamed: '',
  total: '',
  isLocked: false,
  speed: null as string | null,
  comment: null as string | null,
  color: null as string | null,
  showControls: false,
  showAddFundsButton: false,
  showWithdrawButton: false,
  showStartButton: false,
  showPauseButton: false,
  subheader: '',
  direction: null as StreamDirection | null,
  link: '',
});

const progressRedrawTimerFx = createEffect(
  () =>
    new Promise<void>((rs) => {
      setTimeout(rs, 1000);
    }),
);

const streamRevalidationTimerFx = createEffect(
  () =>
    new Promise<void>((rs) => {
      setTimeout(rs, 10000);
    }),
);
/**
 * when last_created_stream is changed, revalidation timer ends or stream id in page URL changed
 * read page stream id
 * check whether page is open
 * and start requesting stream data
 * */
sample({
  clock: [lastCreatedStreamUpdated, pageGate.state, streamRevalidationTimerFx.doneData],
  source: pageGate.state,
  filter: pageGate.status,
  target: requestStreamFx,
});
/**
 * when page is opened or revalidation timer ends
 * start revalidation timer again
 * */
sample({
  clock: [pageGate.open, streamRevalidationTimerFx.doneData],
  filter: pageGate.status,
  target: streamRevalidationTimerFx,
});
sample({
  clock: requestStreamFx.doneData,
  filter: Boolean,
  target: $stream,
});
/** clear stream data when page is closed */
sample({
  clock: pageGate.close,
  fn: () => null,
  target: $stream,
});
sample({
  clock: requestStreamFx.failData,
  fn: (error) => error.message,
  target: $pageError,
});
/** clear error message when stream successfully requested */
sample({
  clock: requestStreamFx.doneData,
  fn: () => null,
  target: $pageError,
});

split({
  source: combine($stream, $pageError, $tokens, (stream, pageError, tokens) => {
    if (pageError || !stream || !tokens[stream.token_account_id]) return null;
    return {
      stream,
      token: tokens[stream.token_account_id],
    };
  }),
  match: (upd) => (upd ? 'dataUpdated' : 'noData'),
  cases: {
    dataUpdated,
    noData,
  },
});

sample({
  clock: [dataUpdated, drawRetriggered],
  source: {accountId: $currentDaoId, oracle: $priceOracle},
  fn({accountId, oracle: {getPriceInUsd: toUsd}}, {stream, token}) {
    const {decimals, symbol} = token.meta;
    const tokenId = token.roketoMeta.account_id;
    const timeLeft = calculateTimeLeft(stream);
    const progress = getStreamProgress({stream});
    const cliffEndTimestamp = calculateCliffEndTimestamp(stream);
    const available = getAvailableToWithdraw(stream).toNumber();
    const direction = getStreamDirection(stream, accountId);
    const color = parseColor(stream.description) ?? null;
    const comment = parseComment(stream.description) ?? null;
    let subheader: string;
    let sign: string;
    switch (direction) {
      case 'IN':
        subheader = 'Incoming stream';
        sign = '+';
        break;
      case 'OUT':
        subheader = 'Outgoing stream';
        sign = '-';
        break;
      case null:
      default:
        subheader = 'Stream';
        sign = '';
        break;
    }
    const streamedInUsd = toUsd(tokenId, toHumanReadableValue(decimals, progress.streamed, 4), 2);
    const totalInUsd = toUsd(tokenId, toHumanReadableValue(decimals, progress.full, 4), 2);
    return {
      active: true,
      sender: direction === 'OUT' ? 'You' : stream.owner_id,
      receiver: direction === 'IN' ? 'You' : stream.receiver_id,
      amount: formatAmount(decimals, progress.full),
      tokenSymbol: symbol,
      cliff: cliffEndTimestamp
        ? {
            title: isPast(cliffEndTimestamp) ? 'Cliff Period Ended' : 'Cliff Period Ends',
            value: formatTimeLeft(cliffEndTimestamp - Date.now()),
          }
        : null,
      remaining: timeLeft || 'Finished',
      tokensAvailable: hasPassedCliff(stream) ? formatAmount(decimals, available) : '0',
      progressText: `${sign}${formatAmount(decimals, progress.streamed)} of ${formatAmount(
        decimals,
        progress.full,
      )}`,
      progressInUSD: `${sign}$${streamedInUsd} of $${totalInUsd}`,
      withdrawnText: formatSmartly(Number(toHumanReadableValue(decimals, progress.withdrawn, 3))),
      cliffPercent: calculateCliffPercent(stream),
      withdrawn: progress.withdrawn,
      streamed: progress.streamed,
      total: progress.full,
      isLocked: stream.is_locked,
      speed: getStreamingSpeed(Number(stream.tokens_per_sec), token),
      color,
      comment,
      showControls: !isDead(stream),
      showAddFundsButton: ableToAddFunds(stream, accountId),
      showWithdrawButton: direction === 'IN' && stream.status === STREAM_STATUS.Active,
      showStartButton: ableToStartStream(stream, accountId),
      showPauseButton: ableToPauseStream(stream, accountId),
      subheader,
      direction: direction ? (direction.toLowerCase() as 'in' | 'out') : direction,
      link: getStreamLink(stream.id),
    };
  },
  target: $streamInfo,
});

/** when redraw timer ends, send actual data to retrigger event */
sample({
  clock: [progressRedrawTimerFx.doneData],
  source: dataUpdated,
  target: drawRetriggered,
});

/**
 * while page is open and stream is not complete yet,
 * redraw progress bas each second
 * */
sample({
  clock: [$stream, progressRedrawTimerFx.doneData],
  filter: combine(
    pageGate.status,
    progressRedrawTimerFx.pending,
    $stream,
    (status, pending, stream) => {
      if (!status || pending || !stream) return false;
      const {left} = getStreamProgress({stream, asPercentage: true});
      return Boolean(stream && !isIdling(stream) && +left > 0);
    },
  ),
  target: [progressRedrawTimerFx],
});

$streamInfo.reset([noData]);
