import {TokenProvider} from '~/entities/authentication-rb-api';
import {env} from '~/shared/config/env';

import {RbApi} from './generated';

export const rbApi = new RbApi({
  baseUrl: env.RB_API,
  TokenProvider,
});

export * from './generated';
