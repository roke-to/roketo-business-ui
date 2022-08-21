import {attach, createStore, sample} from 'effector';
import {keyStores} from 'near-api-js';

import {NearInstance} from '~/shared/api/near';
import {rbApi} from '~/shared/api/rb';
import {getSignature} from '~/shared/lib/get-signature';

export const $keyStore = createStore(new keyStores.BrowserLocalStorageKeyStore());
export const $authenticationHeaders = createStore<Record<string, string> | null>(null);

export const authenticationRbApiFx = attach({
  source: {
    keyStore: $keyStore,
  },
  async effect({keyStore}: {keyStore: keyStores.BrowserLocalStorageKeyStore}, near: NearInstance) {
    if (!near) {
      throw Error('WHERE NEAR ?');
    }
    const {accountId} = near;
    const publicKey = await getPublicKey(accountId, keyStore, near?.near.config);
    const signature = await getSignatureFromKeyStores(accountId, keyStore, near?.near.config);

    const buff = Buffer.from(`${accountId}|${publicKey}|${signature}`);

    const headers = {
      'X-Authorization': `Bearer ${buff.toString('base64')}`,
    };

    return rbApi.authentication
      .authenticationControllerLogIn({headers})
      .then((response) => response.json());
  },
});

async function getPublicKey(
  accountId: string,
  keyStore: keyStores.BrowserLocalStorageKeyStore,
  config: any,
): Promise<string | null> {
  const keyPair = config ? await keyStore?.getKey(config.networkId, accountId) : null;

  const publicKey = keyPair?.getPublicKey();

  if (!publicKey) {
    return null;
  }

  return publicKey.toString();
}

async function getSignatureFromKeyStores(
  accountId: string,
  keyStore: keyStores.BrowserLocalStorageKeyStore,
  config: any,
): Promise<string | null> {
  try {
    const keyPair = config ? await keyStore?.getKey(config.networkId, accountId) : null;

    if (!keyPair) {
      // eslint-disable-next-line no-console
      console.log('Failed to get keyPair');

      return null;
    }

    return await getSignature(keyPair);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to generate signature', err);

    return null;
  }
}

sample({
  source: authenticationRbApiFx.doneData,
  target: $authenticationHeaders,
});
