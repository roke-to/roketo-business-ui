import {isPast} from 'date-fns';
import {attach, combine, createEffect, createEvent, createStore, sample} from 'effector';
import {generatePath} from 'react-router-dom';

import {colorDescriptions} from '~/entities/create-stream/constants';
import type {FormValues} from '~/entities/create-stream/constants';
import {getTokensPerSecondCount} from '~/entities/create-stream/lib';
import {$isMobileScreen} from '~/entities/screens';
import {sendTransactionsFx} from '~/entities/transactions';
import {
  $accountId,
  $accountStreams,
  $currentDaoId,
  $listedTokens,
  $near,
  $priceOracle,
  $roketoWallet,
  $tokens,
  $walletSelector,
} from '~/entities/wallet';
import {astroApi, Proposal} from '~/shared/api/astro';
import {STREAM_STATUS} from '~/shared/api/roketo/constants';
import {
  formatSmartly,
  toHumanReadableValue,
  tokensPerMeaningfulPeriod,
  toYocto,
} from '~/shared/api/token-formatter';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';
import {addStatusProposalQuery} from '~/shared/lib/requestQueryBuilder/add-status-proposal-query';
import {
  areArraysDifferent,
  areObjectsDifferent,
  recordUpdater,
} from '~/shared/lib/roketo/changeDetection';
import {isWNearTokenId} from '~/shared/lib/roketo/isWNearTokenId';
import {getRoundedPercentageRatio} from '~/shared/lib/roketo/math';
import {createProtectedEffect} from '~/shared/lib/roketo/protectedEffect';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';
import {ProposalVariantFilterType} from '~/shared/types/proposal-variant-filter-type';

import {
  ableToAddFunds,
  ableToPauseStream,
  ableToStartStream,
  calculateCliffEndTimestamp,
  calculateCliffPercent,
  calculateTimeLeft,
  formatTimeLeft,
  getStreamDirection,
  getStreamProgress,
  isActiveStream,
  parseColor,
  parseComment,
} from '@roketo/sdk';
import type {RoketoStream} from '@roketo/sdk/dist/types';

import {sorts, statusOptions} from './constants';
import {
  collectTotalFinancialAmountInfo,
  countTotalUSDWithdrawal,
  createStreamProposal,
  getDirectionFilter,
  getStatusFilter,
  getTextFilter,
} from './lib';
import type {
  DirectionFilter,
  FilterFn,
  StatusFilter,
  StreamCardData,
  StreamProgressData,
  StreamSort,
} from './types';

const returnPath = `${window.location.origin}${ROUTES.streamProposals.path}`;

export const $streamListData = createStore(
  {
    streamsLoading: true,
    hasStreams: false,
  },
  {updateFilter: areObjectsDifferent},
);

export const $allStreams = $accountStreams.map(({inputs, outputs}) => [...inputs, ...outputs]);

export const $filteredStreams = createStore<RoketoStream[]>([], {updateFilter: areArraysDifferent});

export const $streamFilter = createStore({
  direction: 'All' as DirectionFilter,
  status: 'All' as StatusFilter,
  text: '',
});

export const changeDirectionFilter = createEvent<DirectionFilter>();
export const changeStatusFilter = createEvent<StatusFilter>();
export const changeTextFilter = createEvent<string>();

export const $statusFilterCounts = createStore<Record<StatusFilter, number>>({
  All: 0,
  Initialized: 0,
  Active: 0,
  Paused: 0,
});

export const changeStreamSort = createEvent<StreamSort>();
export const $streamSort = createStore<StreamSort>(sorts.mostRecent);

export const handleCreateStreamFx = createProtectedEffect({
  source: combine(
    $listedTokens,
    $roketoWallet,
    $near,
    $currentDaoId,
    $walletSelector,
    (listedTokens, roketo, near, currentDaoId, walletSelector) =>
      !!roketo && !!near && !!currentDaoId && !!walletSelector
        ? {listedTokens, roketo, near, currentDaoId, walletSelector}
        : null,
  ),
  async fn(
    {listedTokens: tokens, near: {login}, currentDaoId, walletSelector},
    values: FormValues,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {receiver, delayed, comment, deposit, duration, token, isLocked, cliffDateTime, color} =
      values;
    const {roketoMeta, tokenContract, meta} = tokens[token];
    const tokensPerSec = getTokensPerSecondCount(meta, deposit, duration);

    const creator = () =>
      createStreamProposal({
        deposit: toYocto(meta.decimals, deposit),
        comment,
        receiverId: receiver,
        tokenAccountId: token,
        commissionOnCreate: roketoMeta.commission_on_create,
        tokensPerSec,
        delayed,
        callbackUrl: returnPath,
        isLocked,
        cliffPeriodSec: cliffDateTime
          ? Math.floor((cliffDateTime.getTime() - Date.now()) / 1000)
          : undefined,
        color: color === 'none' ? null : colorDescriptions[color].color,
        accountId: currentDaoId,
        tokenContract,
        roketoContractName: env.ROKETO_CONTRACT_NAME,
        financeContractName: env.ROKETO_FINANCE_CONTRACT_NAME,
        wNearId: env.WNEAR_ID,
        walletSelector,
        currentDaoId,
      });
    try {
      await creator();
    } catch (error) {
      if ((error as Error).message === 'Wallet not signed in') {
        await login();
        await creator();
      } else {
        throw error;
      }
    }
  },
});

export const $financialStatus = createStore({
  outcomeAmountInfo: {
    total: 0,
    streamed: 0,
    withdrawn: 0,
  },
  incomeAmountInfo: {
    total: 0,
    streamed: 0,
    withdrawn: 0,
  },
  availableForWithdrawal: 0,
});

const progressRedrawTimerFx = createEffect(
  () =>
    new Promise<void>((rs) => {
      setTimeout(rs, 1000);
    }),
);

export const $streamCardsData = createStore<Record<string, StreamCardData>>({});

export const $streamsProgress = createStore<Record<string, StreamProgressData>>({});

export const selectStream = createEvent<string | null>();
export const $selectedStream = createStore<string | null>(null);

sample({
  source: {
    tokens: $tokens,
    streams: $accountStreams,
    priceOracle: $priceOracle,
  },
  fn({tokens, streams: {inputs, outputs}, priceOracle}) {
    const activeInputStreams = inputs.filter(isActiveStream);
    const activeOutputStreams = outputs.filter(isActiveStream);
    return {
      outcomeAmountInfo: collectTotalFinancialAmountInfo(activeOutputStreams, tokens, priceOracle),
      incomeAmountInfo: collectTotalFinancialAmountInfo(activeInputStreams, tokens, priceOracle),
      availableForWithdrawal: countTotalUSDWithdrawal(activeInputStreams, tokens, priceOracle),
    };
  },
  target: $financialStatus,
});

sample({
  source: $accountStreams,
  target: $streamListData,
  fn: ({streamsLoaded, inputs, outputs}) => ({
    streamsLoading: !streamsLoaded,
    hasStreams: inputs.length + outputs.length > 0,
  }),
});

sample({
  source: {
    streams: $allStreams,
    filter: $streamFilter,
    currentDaoId: $currentDaoId,
    sort: $streamSort,
  },
  target: $filteredStreams,
  fn({streams, filter: {direction, status, text}, currentDaoId, sort}) {
    const filters = [
      getDirectionFilter(currentDaoId, direction),
      getStatusFilter(status),
      getTextFilter(currentDaoId, text),
    ].filter((fn): fn is FilterFn => !!fn);

    const result =
      filters.length === 0
        ? [...streams]
        : streams.filter((item) => filters.every((filter) => filter(item)));
    return result.sort(sort.fn);
  },
});

sample({
  source: {streams: $allStreams, filter: $streamFilter, currentDaoId: $currentDaoId},
  target: $statusFilterCounts,
  fn({streams, filter, currentDaoId}) {
    const directionFilter = getDirectionFilter(currentDaoId, filter.direction);
    const filteredStreams = directionFilter ? streams.filter(directionFilter) : streams;
    return Object.fromEntries(
      statusOptions.map((status) => {
        const statusFilter = getStatusFilter(status);
        const resultStreams = statusFilter ? filteredStreams.filter(statusFilter) : filteredStreams;
        return [status, resultStreams.length];
      }),
    ) as Record<StatusFilter, number>;
  },
});

sample({clock: changeStreamSort, target: $streamSort});

/** redraw progress bar each second */
sample({
  clock: [$filteredStreams, progressRedrawTimerFx.doneData],
  filter: progressRedrawTimerFx.pending.map((pending) => !pending),
  target: [progressRedrawTimerFx],
});

/**
 * when filtered streams or tokens are changed or redraw timer ends,
 * send actual data to retrigger event
 * */
sample({
  clock: [$filteredStreams, $tokens, progressRedrawTimerFx.doneData],
  source: {
    oldData: $streamsProgress,
    currentDaoId: $currentDaoId,
    tokens: $tokens,
    streams: $filteredStreams,
  },
  target: $streamsProgress,
  fn: ({oldData, currentDaoId, streams, tokens}) =>
    recordUpdater(oldData, streams, (stream) => {
      const {token_account_id: tokenId, tokens_per_sec: tokensPerSec} = stream;
      const token = tokens[tokenId];
      if (!token) return undefined;
      const {decimals} = token.meta;
      const symbol = isWNearTokenId(tokenId) ? 'NEAR' : token.meta.symbol;
      const cliffEndTimestamp = calculateCliffEndTimestamp(stream);
      const progress = getStreamProgress({stream});
      const timeLeft = calculateTimeLeft(stream);
      const streamed = Number(toHumanReadableValue(decimals, progress.streamed, 3));
      const withdrawn = Number(toHumanReadableValue(decimals, progress.withdrawn, 3));
      const total = Number(toHumanReadableValue(decimals, progress.full, 3));

      const streamedText = formatSmartly(streamed);
      const withdrawnText = formatSmartly(withdrawn);

      const streamedPercentage = getRoundedPercentageRatio(progress.streamed, progress.full, 1);
      const withdrawnPercentage = getRoundedPercentageRatio(
        progress.withdrawn,
        progress.streamed,
        1,
      );

      const {formattedValue: speedFormattedValue, unit: speedUnit} = tokensPerMeaningfulPeriod(
        decimals,
        tokensPerSec,
      );
      const direction = getStreamDirection(stream, currentDaoId);
      let sign: string;
      switch (direction) {
        case 'IN':
          sign = '+';
          break;
        case 'OUT':
          sign = '-';
          break;
        case null:
        default:
          sign = '';
          break;
      }
      return {
        symbol,
        progressFull: progress.full,
        progressStreamed: progress.streamed,
        progressWithdrawn: progress.withdrawn,
        cliffPercent: calculateCliffPercent(stream),
        cliffText:
          cliffEndTimestamp && !isPast(cliffEndTimestamp)
            ? formatTimeLeft(cliffEndTimestamp - Date.now())
            : null,
        speedFormattedValue,
        speedUnit,
        timeLeft,
        streamedText,
        totalText: total.toString(),
        streamedPercentage,
        withdrawnText,
        withdrawnPercentage,
        direction: direction ? (direction.toLowerCase() as 'in' | 'out') : null,
        sign,
        name: direction === 'IN' ? stream.owner_id : stream.receiver_id,
      };
    }),
});

sample({
  clock: $filteredStreams,
  source: {currentDaoId: $currentDaoId, oldData: $streamCardsData},
  fn: ({currentDaoId, oldData}, streams) =>
    recordUpdater(oldData, streams, (stream, id) => {
      const direction = getStreamDirection(stream, currentDaoId);
      const isIncomingStream = direction === 'IN';
      const iconType: keyof typeof STREAM_STATUS =
        typeof stream.status === 'string' ? stream.status : 'Finished';
      return {
        streamPageLink: generatePath(ROUTES.stream.path, {id}),
        comment: parseComment(stream.description),
        color: parseColor(stream.description),
        name: isIncomingStream ? stream.owner_id : stream.receiver_id,
        isLocked: stream.is_locked,
        showAddFundsButton: ableToAddFunds(stream, currentDaoId),
        showWithdrawButton: direction === 'IN' && isActiveStream(stream),
        showStartButton: ableToStartStream(stream, currentDaoId),
        showPauseButton: ableToPauseStream(stream, currentDaoId),
        iconType,
      };
    }),
  target: $streamCardsData,
});

sample({
  clock: selectStream,
  source: $selectedStream,
  filter: $isMobileScreen,
  fn: (currentSelection, upd) => (upd === currentSelection ? null : upd),
  target: $selectedStream,
});

sample({
  clock: $isMobileScreen,
  filter: (isMobileScreen) => !isMobileScreen,
  fn: () => null,
  target: $selectedStream,
});

$streamFilter.on(changeDirectionFilter, (filter, direction) => ({...filter, direction}));
$streamFilter.on(changeStatusFilter, (filter, status) => ({...filter, status}));
$streamFilter.on(changeTextFilter, (filter, text) => ({...filter, text}));

// ------------ proposals ------------

export const $streamProposals = createStore<Proposal[]>([]);

export const $streamProposalLoading = createStore(true);

// /------------ proposals ------------

//  ------------ proposals filter by status ------------

export const changeStreamProposalSelectedStatus = createEvent<ProposalStatusFilterType>();

export const $streamSelectedProposalStatus = createStore<ProposalStatusFilterType>('all').on(
  changeStreamProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals filter by kind ------------
export const changeStreamProposalSelectedVariant = createEvent<ProposalVariantFilterType>();

export const $streamSelectedProposalVariant = createStore<ProposalVariantFilterType>('Any').on(
  changeStreamProposalSelectedVariant,
  (_, proposalVariant) => proposalVariant,
);
//  /------------ proposals filter by kind ------------

//  ------------ proposals sort by createAt  ------------
export const changeStreamProposalSortOrder = createEvent<ProposalSortOrderType>();

export const $streamProposalSortOrder = createStore<ProposalSortOrderType>('DESC').on(
  changeStreamProposalSortOrder,
  (_, sortType) => sortType,
);
//  /------------ proposals sort by createAt ------------

const loadStreamProposalsFx = attach({
  source: {
    daoId: $currentDaoId,
    accountId: $accountId,
    status: $streamSelectedProposalStatus,
    variant: $streamSelectedProposalVariant,
    sort: $streamProposalSortOrder,
  },
  async effect({daoId, accountId, status, variant, sort}) {
    const query = {
      ...addStatusProposalQuery(status),
      limit: 20,
      offset: 0,
      type: 'FunctionCall',
      orderBy: 'createdAt',
      order: sort,
      accountId,
      dao: daoId,
    };

    return astroApi.proposalControllerProposals(query).then((response) => {
      const proposals = response.data as unknown as Proposal[];
      return proposals.filter((p) => {
        if (variant !== 'Any') {
          return p.description.includes(variant);
        }
        return (
          p.description.includes('ProposeCreateRoketoStream') ||
          p.description.includes('ProposePauseRoketoStream') ||
          p.description.includes('ProposeStartRoketoStream') ||
          p.description.includes('ProposeStopRoketoStream') ||
          p.description.includes('ProposeRoketoStreamWithdraw')
        );
      });
    });
  },
});

sample({
  source: sendTransactionsFx.doneData,
  target: loadStreamProposalsFx,
});
sample({
  clock: $currentDaoId,
  target: loadStreamProposalsFx,
});

sample({
  source: loadStreamProposalsFx.doneData,
  target: $streamProposals,
});

sample({
  clock: changeStreamProposalSelectedStatus,
  target: loadStreamProposalsFx,
});

sample({
  clock: changeStreamProposalSelectedVariant,
  target: loadStreamProposalsFx,
});

sample({
  clock: changeStreamProposalSortOrder,
  target: loadStreamProposalsFx,
});
sample({
  clock: loadStreamProposalsFx.finally,
  fn: () => false,
  target: $streamProposalLoading,
});
sample({
  clock: loadStreamProposalsFx,
  fn: () => true,
  target: $streamProposalLoading,
});
