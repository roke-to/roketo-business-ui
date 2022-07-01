import {useStore} from 'effector-react';

import {$accountId, $isSignedIn} from '~/entities/wallet';

export const ProfileName = () => {
  const accountId = useStore($accountId);
  const isSignedIn = useStore($isSignedIn);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return isSignedIn ? <>{accountId}</> : null;
};
