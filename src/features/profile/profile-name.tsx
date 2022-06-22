import {useStore} from 'effector-react';

import {$isSignedIn} from '~/entities/app';
import {$accountId} from '~/entities/near-wallet';

export const ProfileName = () => {
  const accountId = useStore($accountId);
  const isSignedIn = useStore($isSignedIn);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return isSignedIn ? <>{accountId}</> : null;
};
