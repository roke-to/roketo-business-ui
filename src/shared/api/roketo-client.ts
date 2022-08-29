import {NearInstance} from '~/shared/api/near';
import {env} from '~/shared/config/env';

import {
  AuthApi,
  Configuration,
  createConfiguration,
  LoginDto,
  ServerConfiguration,
  UsersApi,
} from '@roketo/api-client';

const serverConfig = {baseServer: new ServerConfiguration(env.WEB_API_URL, {})};

export class TokenProvider {
  constructor(private readonly accountId: string, private readonly near: NearInstance) {}

  private initialized: boolean = false;

  private token: null | Promise<string> = null;

  private readonly authApiClient = new AuthApi(createConfiguration({...serverConfig}));

  getToken() {
    if (!this.token) {
      this.token = this.getRefreshedToken();
    }

    return this.token;
  }

  refreshToken() {
    this.token = this.getRefreshedToken();
  }

  private async getRefreshedToken(): Promise<string> {
    try {
      const ROKETO_API_ACCESS_TOKEN_KEY_PREFIX = 'roketoApiAccessToken';

      const key = `${ROKETO_API_ACCESS_TOKEN_KEY_PREFIX}:${this.accountId}`;

      if (!this.initialized) {
        this.initialized = true;

        const savedToken = localStorage[key] || null;

        if (savedToken && !this.containsUnicode(savedToken)) {
          return savedToken;
        }
      }

      delete localStorage[key];

      const loginParams = await this.generateLoginParams();

      const {accessToken} = await this.authApiClient.login(loginParams);

      localStorage[key] = accessToken;

      return accessToken;
    } catch (e) {
      // TODO: Think of better handling of failing login.
      this.token = null;

      throw e;
    }
  }

  private async generateLoginParams(): Promise<LoginDto> {
    const keyPair = await this.near.near.config.keyStore.getKey(
      this.near.near.config.networkId,
      this.accountId,
    );

    const timestamp = Date.now();

    const {signature: Uint8Signature} = keyPair.sign(new TextEncoder().encode(String(timestamp))); // TODO: Polyfill TextEncoder?

    const signature: number[] = Array.from(Uint8Signature);

    return {
      accountId: this.accountId,
      timestamp,
      signature,
    };
  }

  private containsUnicode(token: string) {
    return token !== encodeURIComponent(token);
  }
}

export const tokenProvider = (accountId: string, near: NearInstance) =>
  new TokenProvider(accountId, near);

export const apiConfig = (tp: TokenProvider) =>
  createConfiguration({
    ...serverConfig,
    authMethods: {bearer: {tokenProvider: tp}},
  });

export const usersApiClient = (config: Configuration) => new UsersApi(config);
