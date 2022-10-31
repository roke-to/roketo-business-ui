import {createEvent, sample} from 'effector';

import {changeConnectionEndpoint} from '~/entities/wallet';
import {env} from '~/shared/config/env';

export const initApp = createEvent();

sample({
  clock: initApp,
  fn: () => env.NETWORK_ID,
  target: changeConnectionEndpoint,
});
