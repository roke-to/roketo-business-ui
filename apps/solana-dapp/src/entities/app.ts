import {changeConnectionEndpoint} from '~/entities/wallet';
import {env} from '~/shared/config/env';

import {createEvent, sample} from '@roketo/core/lib/effector';

export const initApp = createEvent();

sample({
  clock: initApp,
  fn: () => env.NETWORK_ID,
  target: changeConnectionEndpoint,
});
