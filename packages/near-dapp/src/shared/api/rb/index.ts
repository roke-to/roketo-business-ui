import {TokenProvider} from '~/entities/authentication-rb-api';
import {env} from '~/shared/config/env';

import {Api as RbApi} from './generated/rb-api';

export const rbApiAuthInstance = new RbApi({
  baseUrl: env.RB_API,
});

const tokenProvider = new TokenProvider(rbApiAuthInstance);

export const rbApi = new RbApi({
  baseUrl: env.RB_API,
  securityWorker: async () => ({
    headers: {
      ...(await tokenProvider.getToken()),
    },
  }),
  customFetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const fetchResult = await fetch(input, init);

    if (fetchResult.status === 401) {
      await tokenProvider.refreshToken();

      const headers = {
        ...(await tokenProvider.getToken()),
      };

      return fetch(input, {...init, headers});
    }
    return fetchResult;
  },
});

export * from './generated/rb-api';
