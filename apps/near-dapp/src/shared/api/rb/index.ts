import {TokenProvider} from '~/entities/authentication-rb-api';
import {env} from '~/shared/config/env';

// eslint-disable-next-line import/extensions
import {RbApi} from './generated';

export const rbApi = new RbApi({
  baseUrl: env.RB_API,
  TokenProvider,
});

// eslint-disable-next-line import/extensions
export * from './generated';
