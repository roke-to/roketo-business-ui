import {useStore} from 'effector-react';

import {$isSignedIn} from '~/entities/app';
import {$nearWallet} from '~/entities/near-wallet';

export const AuthorizeButton: React.FC<{className?: string}> = ({className}) => {
  const nearWallet = useStore($nearWallet);
  const signedIn = useStore($isSignedIn);

  if (!signedIn) {
    return (
      <button type="button" onClick={nearWallet?.auth.login} className={className}>
        Sign in with NEAR Wallet
      </button>
    );
  }

  return (
    <button type="button" onClick={nearWallet?.auth.logout} className={className}>
      Logout
    </button>
  );
};
