import {combine} from 'effector';

import {addFunds} from '~/entities/streams/lib';
import {$currentDaoId, $listedTokens, $walletSelector} from '~/entities/wallet';
import {toYocto} from '~/shared/api/token-formatter';
import {env} from '~/shared/config/env';

import {createProtectedEffect} from '@roketo/core/roketo/protectedEffect';

export const addFundsFx = createProtectedEffect({
  source: combine(
    $listedTokens,
    $currentDaoId,
    $walletSelector,
    (listedTokens, currentDaoId, walletSelector) =>
      !!currentDaoId && !!walletSelector ? {listedTokens, currentDaoId, walletSelector} : null,
  ),
  async fn(
    {listedTokens: tokens, currentDaoId, walletSelector},
    {
      streamId,
      hasValidAdditionalFunds,
      tokenAccountId,
      deposit,
    }: {
      streamId: string;
      hasValidAdditionalFunds: boolean;
      tokenAccountId: string;
      deposit: string;
    },
  ) {
    if (!hasValidAdditionalFunds) return null;
    const {meta} = tokens[tokenAccountId];
    const amount = toYocto(meta.decimals, deposit);

    return addFunds({
      amount,
      streamId,
      callbackUrl: window.location.href,
      tokenAccountId,
      roketoContractName: env.ROKETO_CONTRACT_NAME,
      wNearId: env.WNEAR_ID,
      currentDaoId,
      walletSelector,
    });
  },
});
