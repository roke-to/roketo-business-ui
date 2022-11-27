import {isAccountExist} from '~/shared/api/near/is-account-exists';

import {createEffect} from '@roketo/core/lib/effector';

export const isAccountExistFx = createEffect(async (accountId: string) =>
  isAccountExist(accountId),
);
