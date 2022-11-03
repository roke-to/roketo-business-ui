import {createEvent, sample} from 'effector';

import {env} from '~/shared/config/env';

import {initWallet} from './wallet';

export const initApp = createEvent();

sample({
  clock: initApp,
  fn: () => {
    console.log('env', env);
  },
  target: initWallet,
});
