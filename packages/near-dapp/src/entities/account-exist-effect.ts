import {createEffect} from 'effector';

import {isAccountExist} from '~/shared/api/near/is-account-exists';

export const isAccountExistFx = createEffect(async (accountId: string) =>
  isAccountExist(accountId),
);
