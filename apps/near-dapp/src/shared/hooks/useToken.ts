import {useStore} from 'effector-react';

import {$listedTokens} from '~/entities/wallet';
import {env} from '~/shared/config/env';

import {isWNearTokenId} from '@roketo/core/roketo/isWNearTokenId';

export function useToken(tokenAccountId: string) {
  const tokens = useStore($listedTokens);

  if (isWNearTokenId(tokenAccountId, env.WNEAR_ID) && tokenAccountId in tokens) {
    tokens[tokenAccountId].meta.symbol = 'NEAR';
  }

  return tokens[tokenAccountId];
}
