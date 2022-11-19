import {keyStores} from 'near-api-js';

import {$keyStore, $near} from '~/entities/wallet';
import type {RbApi} from '~/shared/api/rb';
import {getSignature} from '~/shared/lib/get-signature';

export class TokenProvider {
  private token: null | Promise<any> = null;

  // constructor(private login: LoginHandler) {}
  constructor(private rbApi: RbApi<unknown, typeof TokenProvider>) {}

  getToken() {
    if (!this.token) {
      this.token = this.getRefreshedToken();
    }

    return this.token;
  }

  refreshToken() {
    this.token = this.getRefreshedToken();
  }

  async getRefreshedToken() {
    const near = $near.getState();
    if (!near) {
      throw Error('WHERE NEAR ?');
    }
    const {accountId} = near;
    const keyStore = $keyStore.getState();
    const publicKey = await getPublicKey(accountId, keyStore, near?.near.config);
    const signature = await getSignatureFromKeyStores(accountId, keyStore, near?.near.config);

    const buff = Buffer.from(`${accountId}|${publicKey}|${signature}`);
    const headers = {
      'X-Authorization': `Bearer ${buff.toString('base64')}`,
    };

    const token = await this.rbApi.authentication.authenticationControllerLogIn({
      headers,
    });

    return token;
  }
}

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
