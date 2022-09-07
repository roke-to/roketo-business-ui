import * as nearApi from 'near-api-js';
import {BigNumber} from 'bignumber.js';
import {Get} from 'type-fest';

import {mapCreateRoketoStreamOptions} from '~/shared/api/near/contracts/sputnik-dao/map-create-roketo-stream-options';
import type {PriceOracle} from '~/shared/api/price-oracle';
import {toHumanReadableValue} from '~/shared/api/token-formatter';
import {FTContract} from '~/shared/api/types';

import {WalletSelector} from '@near-wallet-selector/core';
import {SignAndSendTransactionsParams} from '@near-wallet-selector/core/lib/wallet';
import {getAvailableToWithdraw, getStreamProgress, parseComment} from '@roketo/sdk';
import type {RichToken, RoketoStream} from '@roketo/sdk/dist/types';

import type {DirectionFilter, FilterFn, StatusFilter} from './types';

const INITIAL_VALUE = new BigNumber(0);
const MANTISSA = 3;

export const countTotalUSDWithdrawal = (
  streams: RoketoStream[],
  tokens: Record<string, RichToken>,
  priceOracle: PriceOracle,
) => {
  const availableForWithdrawal = streams
    .filter((stream) => tokens[stream.token_account_id])
    .reduce((withdrawalSum, inputStream) => {
      const tokenAccountId = inputStream.token_account_id;
      const {meta} = tokens[tokenAccountId];

      const withdrawal = getAvailableToWithdraw(inputStream).toFixed();
      const amountForDisplay = toHumanReadableValue(meta.decimals, withdrawal, MANTISSA);

      const amountInUSD = priceOracle.getPriceInUsd(tokenAccountId, amountForDisplay);

      return withdrawalSum.plus(amountInUSD);
    }, INITIAL_VALUE);

  return Number(availableForWithdrawal.toFixed(0));
};

export const collectTotalFinancialAmountInfo = (
  streams: RoketoStream[],
  tokens: Record<string, RichToken>,
  priceOracle: PriceOracle,
) => {
  const initialInfo = {total: INITIAL_VALUE, streamed: INITIAL_VALUE, withdrawn: INITIAL_VALUE};

  const totalFinancialInfo = streams
    .filter((stream) => tokens[stream.token_account_id])
    .reduce((financialInfoAccumulator, stream) => {
      const tokenAccountId = stream.token_account_id;
      const {meta} = tokens[tokenAccountId];

      const progress = getStreamProgress({stream});

      const streamedAmountForDisplay = toHumanReadableValue(
        meta.decimals,
        progress.streamed,
        MANTISSA,
      );
      const streamedUSD = priceOracle.getPriceInUsd(tokenAccountId, streamedAmountForDisplay);

      const fullAmountForDisplay = toHumanReadableValue(meta.decimals, progress.full, MANTISSA);
      const fullUSD = priceOracle.getPriceInUsd(tokenAccountId, fullAmountForDisplay);

      const withdrawnAmountForDisplay = toHumanReadableValue(
        meta.decimals,
        progress.withdrawn,
        MANTISSA,
      );
      const withdrawnUSD = priceOracle.getPriceInUsd(tokenAccountId, withdrawnAmountForDisplay);

      return {
        total: financialInfoAccumulator.total.plus(fullUSD),
        streamed: financialInfoAccumulator.streamed.plus(streamedUSD),
        withdrawn: financialInfoAccumulator.withdrawn.plus(withdrawnUSD),
      };
    }, initialInfo);

  return {
    total: Number(totalFinancialInfo.total.toFixed(0)),
    streamed: Number(totalFinancialInfo.streamed.toFixed(0)),
    withdrawn: Number(totalFinancialInfo.withdrawn.toFixed(0)),
  };
};

export function getDirectionFilter(
  daoId: string | null,
  direction: DirectionFilter,
): FilterFn | null {
  switch (direction) {
    case 'Incoming':
      return (stream) => stream.receiver_id === daoId;
    case 'Outgoing':
      return (stream) => stream.owner_id === daoId;
    default:
      return null;
  }
}

export function getStatusFilter(status: StatusFilter): FilterFn | null {
  switch (status) {
    case 'Initialized':
    case 'Active':
    case 'Paused':
      return (stream) => stream.status === status;
    default:
      return null;
  }
}

export function getTextFilter(accountId: string | null, text: string): FilterFn | null {
  const trimmedText = text.trim();
  if (trimmedText.length > 0) {
    return ({description, owner_id, receiver_id}) => {
      const comment = parseComment(description) ?? '';

      const counterActor = accountId === owner_id ? receiver_id : owner_id;
      return comment.includes(trimmedText) || counterActor.includes(trimmedText);
    };
  }
  return null;
}

export const STORAGE_DEPOSIT = '0.0025';

async function isRegistered({
  accountId,
  tokenContract,
}: {
  accountId: string;
  tokenContract: FTContract;
}) {
  const res = await tokenContract.storage_balance_of({account_id: accountId});
  return res && res.total !== '0';
}

export async function countStorageDeposit({
  tokenContract,
  storageDepositAccountIds,
  roketoContractName,
  financeContractName,
}: {
  tokenContract: FTContract;
  storageDepositAccountIds: Array<string>;
  roketoContractName: string;
  financeContractName: string;
}) {
  const allAccountIds = [...storageDepositAccountIds, roketoContractName, financeContractName];

  const isRegisteredAccountIds = await Promise.all(
    allAccountIds.map((accountId) => isRegistered({accountId, tokenContract})),
  );

  let depositSum = new BigNumber(0);
  /** account creation costs 0.0025 NEAR for storage */
  const depositAmount = nearApi.utils.format.parseNearAmount(STORAGE_DEPOSIT)!;

  allAccountIds.forEach((accountId, index) => {
    if (!isRegisteredAccountIds[index]) depositSum = depositSum.plus(depositAmount);
  });

  return {
    isRegisteredAccountIds,
    depositSum,
    depositAmount,
  };
}

export async function createStreamProposal({
  currentDaoId,
  comment,
  deposit,
  receiverId,
  tokenAccountId,
  commissionOnCreate,
  tokensPerSec,
  cliffPeriodSec,
  delayed = false,
  isExpirable,
  isLocked,
  callbackUrl,
  color,
  accountId,
  tokenContract,
  roketoContractName,
  wNearId,
  financeContractName,
  walletSelector,
}: {
  currentDaoId: string;
  comment: string;
  deposit: string;
  commissionOnCreate: string;
  receiverId: string;
  tokenAccountId: string;
  tokensPerSec: string;
  name?: string;
  cliffPeriodSec?: number;
  delayed?: boolean;
  isExpirable?: boolean;
  isLocked?: boolean;
  callbackUrl?: string;
  color: string | null;
  accountId: string;
  tokenContract: FTContract;
  roketoContractName: string;
  wNearId: string;
  financeContractName: string;
  walletSelector: WalletSelector;
}) {
  const totalAmount = new BigNumber(deposit).plus(commissionOnCreate).toFixed(0);
  const transferPayload = {
    balance: deposit,
    owner_id: accountId,
    receiver_id: receiverId,
    tokens_per_sec: tokensPerSec,
    cliff_period_sec: cliffPeriodSec,
    is_locked: isLocked,
    is_auto_start_enabled: !delayed,
    is_expirable: isExpirable,
  };
  if (color || comment.length > 0) {
    const description: {c?: string; col?: string} = {};
    if (color) description.col = color;
    if (comment.length > 0) description.c = comment;
    // @ts-expect-error
    transferPayload.description = JSON.stringify(description);
  }

  // collect transactions for safe transfer
  // https://github.com/near-daos/astro-ui/blob/368a710439c907ff5295625e98e87b5685319df3/services/sputnik/SputnikNearService/services/NearService.ts#L481
  const transactions: Get<SignAndSendTransactionsParams, 'transactions'> = [];

  const wallet = await walletSelector.wallet();

  const storageDepositAccountIds = [transferPayload.owner_id, transferPayload.receiver_id];

  const {depositSum} = await countStorageDeposit({
    tokenContract,
    storageDepositAccountIds,
    roketoContractName,
    financeContractName,
  });

  transactions.push({
    receiverId: currentDaoId,
    actions: [
      {
        type: 'FunctionCall',
        params: mapCreateRoketoStreamOptions({
          description: '',
          link: '',
          tokenAccountId,
          roketoContractName,
          totalAmount,
          transferPayload,
          wNearId,
          depositSum,
        }),
      },
    ],
  });

  return wallet.signAndSendTransactions({
    transactions,
    callbackUrl,
  });
}
