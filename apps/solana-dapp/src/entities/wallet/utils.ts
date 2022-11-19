// eslint-disable-next-line @typescript-eslint/naming-convention
import getEnvironment, {Environment} from '~/entities/wallet/getEnvironment';

import {Adapter} from '@solana/wallet-adapter-base';

let userAgent: string | null;

function getUserAgent() {
  if (userAgent === undefined) {
    userAgent = globalThis.navigator?.userAgent ?? null;
  }
  return userAgent;
}

export function getIsMobile(adapters: Adapter[]) {
  const userAgentString = getUserAgent();
  return getEnvironment({adapters, userAgentString}) === Environment.MOBILE_WEB;
}

export function getUriForAppIdentity() {
  const {location} = globalThis;
  if (location == null) {
    return;
  }
  return `${location.protocol}//${location.host}`;
}
