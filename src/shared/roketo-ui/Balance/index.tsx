import {useStore} from 'effector-react';
import React from 'react';

import {$priceOracle} from '~/entities/wallet';
import {formatAmount} from '~/shared/api/token-formatter';
import {useToken} from '~/shared/hooks/useToken';

export function useBalanceForToken(tokenId: string) {
  const token = useToken(tokenId);

  const actualCryptoBalance = token?.balance ?? '0';

  return formatAmount(token?.meta.decimals ?? 0, actualCryptoBalance);
}

export enum DisplayMode {
  USD = 'USD',
  CRYPTO = 'CRYPTO',
  BOTH = 'BOTH',
}

type BalanceProps = {
  tokenAccountId: string;
  className?: string;
  // Display balance in USD or in Crypto currency
  mode?: DisplayMode;
};

export function Balance({tokenAccountId, className, mode = DisplayMode.CRYPTO}: BalanceProps) {
  const priceOracle = useStore($priceOracle);

  const token = useToken(tokenAccountId);

  const displayedCryptoAmount = useBalanceForToken(tokenAccountId);

  const showInUSD = mode === DisplayMode.USD;

  const amount = showInUSD
    ? priceOracle.getPriceInUsd(tokenAccountId, displayedCryptoAmount) ?? 0
    : displayedCryptoAmount;
  const currencySymbol = showInUSD ? '$' : token?.meta.symbol ?? '$';

  return (
    <span className={className}>
      {currencySymbol} {amount}
    </span>
  );
}
