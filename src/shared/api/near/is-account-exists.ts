import {keyStores, Near} from 'near-api-js';

import {env} from '~/shared/config/env';

import {getNetworkPreset} from './options';

export const isAccountExist = async (accountId: string): Promise<boolean> => {
  const near = new Near({
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    ...getNetworkPreset(env.NEAR_NETWORK_ID),
    headers: {},
  });

  const account = await near.account(accountId);

  try {
    await account.state();
    console.log('isAccountExist', accountId, true);
    return true;
  } catch (e) {
    console.log('isAccountExist', accountId, false);
    return false;
  }
};
