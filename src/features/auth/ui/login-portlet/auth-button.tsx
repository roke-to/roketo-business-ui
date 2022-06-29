import {useStore} from 'effector-react';

import {$isSignedIn} from '~/entities/app';
import {$nearWallet} from '~/entities/near-wallet';
import {Button, ButtonProps} from '~/shared/ui/components';

export type AuthButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;

export const AuthButton: React.FC<AuthButtonProps> = (props) => {
  const nearWallet = useStore($nearWallet);
  const signedIn = useStore($isSignedIn);

  if (!signedIn) {
    return (
      <Button {...props} onClick={nearWallet?.auth.login}>
        Sign in with NEAR Wallet
      </Button>
    );
  }

  return (
    <Button {...props} onClick={nearWallet?.auth.logout}>
      Logout
    </Button>
  );
};
