import type {BigNumber} from 'bignumber.js';

import {withdrawStreams} from '~/entities/streams/lib';
import {$accountStreams, $currentDaoId, $tokens, $walletSelector} from '~/entities/wallet';
import {formatAmount} from '~/shared/api/token-formatter';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';

import {combine, createEvent, createStore, sample} from '@roketo/core/lib/effector';
import {createProtectedEffect} from '@roketo/core/roketo/protectedEffect';
import {getAvailableToWithdraw, hasPassedCliff, isActiveStream} from '@roketo/sdk';

const returnPath = `${window.location.origin}${ROUTES.streamProposals.path}`;

export const triggerWithdrawAll = createEvent();

export const withdrawAllFx = createProtectedEffect({
  source: combine($currentDaoId, $walletSelector, (currentDaoId, walletSelector) =>
    !!currentDaoId && !!walletSelector ? {currentDaoId, walletSelector} : null,
  ),
  fn({currentDaoId, walletSelector}, streamIds: string[]) {
    return withdrawStreams({
      streamIds,
      roketoContractName: env.ROKETO_CONTRACT_NAME,
      currentDaoId,
      walletSelector,
      callbackUrl: returnPath,
    });
  },
});

const $activeTokensInfo = createStore<{
  tokenData: Array<{
    tokenAccountId: string;
    amount: string;
    symbol: string;
  }>;
  streamIds: string[];
}>({tokenData: [], streamIds: []});

export const $tokenData = $activeTokensInfo.map(({tokenData}) => tokenData);

/**
 * when triggerWithdrawAll is called
 * read streamIds from $activeTokensInfo
 * and if streamIds is not empty
 * then trigger withdrawAllFx with it
 */
sample({
  clock: triggerWithdrawAll,
  source: $activeTokensInfo.map(({streamIds}) => streamIds),
  filter: (streamIds) => streamIds.length > 0,
  target: withdrawAllFx,
});

sample({
  source: {
    tokens: $tokens,
    streams: $accountStreams,
  },
  target: $activeTokensInfo,
  fn({tokens, streams: {inputs}}) {
    const activeInputs = inputs.filter(isActiveStream);
    const tokensData: {
      [tokenAccountId: string]: {
        available: BigNumber;
        tokenAccountId: string;
      };
    } = {};
    const streamIds: string[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const stream of activeInputs) {
      if (!hasPassedCliff(stream)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const tokenAccountId = stream.token_account_id;
      const available = getAvailableToWithdraw(stream);

      if (available.toFixed() !== '0') {
        streamIds.push(stream.id);
      }

      if (!tokensData[tokenAccountId]) {
        tokensData[tokenAccountId] = {
          available,
          tokenAccountId,
        };
      } else {
        tokensData[tokenAccountId].available = tokensData[tokenAccountId].available.plus(available);
      }
    }
    return {
      tokenData: Object.values(tokensData)
        .filter((value) => tokens[value.tokenAccountId])
        .map((value) => {
          const {meta} = tokens[value.tokenAccountId];
          return {
            tokenAccountId: value.tokenAccountId,
            amount: formatAmount(meta.decimals, value.available.toFixed()),
            symbol: meta.symbol,
          };
        }),
      streamIds,
    };
  },
});
