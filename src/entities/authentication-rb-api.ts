import {attach, sample} from 'effector';
import {keyStores} from 'near-api-js';

import {$accountId, $keyStore, $near, createWalletSelectorInstanceFx} from '~/entities/wallet';
import {rbApi} from '~/shared/api/rb';
import {getSignature} from '~/shared/lib/get-signature';

export const authenticationRbApiFx = attach({
  source: {
    accountId: $accountId,
    near: $near,
    keyStore: $keyStore,
  },
  async effect({accountId, keyStore, near}) {
    const publicKey = await getPublicKey(accountId, keyStore, near?.near.config);
    const signature = await getSignatureFromKeyStores(accountId, keyStore, near?.near.config);

    const buff = Buffer.from(`${accountId}|${publicKey}|${signature}`);

    const headers = {
      'X-Authorization': `Bearer ${buff.toString('base64')}`,
    };

    return rbApi.authentication.authenticationControllerLogIn({headers});
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
  clock: createWalletSelectorInstanceFx.doneData,
  fn: () => null,
  target: authenticationRbApiFx,
});
