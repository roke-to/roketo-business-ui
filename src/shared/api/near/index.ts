import {env} from '~/shared/config/env';
import {ReactComponent as MyNearWalletLogo} from '~/shared/ui/icons/my-near-wallet.svg';
import {ReactComponent as NearWalletLogo} from '~/shared/ui/icons/near-wallet.svg';

import {setupWalletSelector} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
import {setupNearWallet} from '@near-wallet-selector/near-wallet';

export const initWalletSelector = () =>
  setupWalletSelector({
    network: env.NEAR_NETWORK_ID,
    debug: true,
    modules: [
      setupNearWallet({
        iconUrl: 'NearWalletLogo',
      }),
      setupMyNearWallet({
        iconUrl: 'MyNearWalletLogo',
      }),
      // TODO: setupSender after https://github.com/near/wallet-selector/pull/339
      // setupSender(),
    ],
  });

const walletIcons = {
  MyNearWalletLogo,
  NearWalletLogo,
};

export const resolveWalletIcon = (iconUrl: string) =>
  walletIcons[iconUrl as keyof typeof walletIcons];
