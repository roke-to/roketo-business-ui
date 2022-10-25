import {WalletIconType} from '~/shared/api/near/options';
import {ReactComponent as MyNearWalletLogo} from '~/shared/ui/icons/wallet/my-near-wallet.svg';
import {ReactComponent as NearWalletLogo} from '~/shared/ui/icons/wallet/near-wallet.svg';
import {ReactComponent as SenderLogo} from '~/shared/ui/icons/wallet/sender.svg';

const walletIcons = {
  [WalletIconType.MyNearWallet]: MyNearWalletLogo,
  [WalletIconType.NearWallet]: NearWalletLogo,
  [WalletIconType.Sender]: SenderLogo,
};

export const resolveWalletIcon = (iconUrl: WalletIconType) => walletIcons[iconUrl];
