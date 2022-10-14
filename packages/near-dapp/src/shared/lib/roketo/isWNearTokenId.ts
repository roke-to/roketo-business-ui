import {env} from '~/shared/config/env';

export function isWNearTokenId(tokenAccountId: string) {
  return tokenAccountId === env.WNEAR_ID;
}
