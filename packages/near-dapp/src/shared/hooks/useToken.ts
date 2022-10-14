import {useStore} from 'effector-react';

import {$listedTokens} from '~/entities/wallet';
import {isWNearTokenId} from '~/shared/lib/roketo/isWNearTokenId';

export function useToken(tokenAccountId: string) {
  const tokens = useStore($listedTokens);

  if (isWNearTokenId(tokenAccountId) && tokenAccountId in tokens) {
    tokens[tokenAccountId].meta.symbol = 'NEAR';
  }

  return tokens[tokenAccountId];
}
