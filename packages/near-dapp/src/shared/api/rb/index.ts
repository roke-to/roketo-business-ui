import {env} from '~/shared/config/env';

import {Api as RbApi} from './generated/rb-api';

export const rbApi = new RbApi({
  baseUrl: env.RB_API,
});

export * from './generated/rb-api';
