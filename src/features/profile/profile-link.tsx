import {useStore} from 'effector-react';
import {Link} from 'react-router-dom';

import {$isSignedIn} from '~/entities/app';
import {$accountId} from '~/entities/near-wallet';
import {ROUTES} from '~/shared/config/routes';

export const ProfileLink: React.FC<{className?: string}> = ({className}) => {
  const accountId = useStore($accountId);
  const isSignedIn = useStore($isSignedIn);

  return isSignedIn ? (
    <Link to={ROUTES.profile.path} className={className}>
      {accountId}
    </Link>
  ) : null;
};
