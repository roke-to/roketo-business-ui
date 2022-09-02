import {Account, connect, keyStores, Near, WalletConnection} from 'near-api-js';

import {env} from '~/shared/config/env';

import {setupWalletSelector} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
import {setupNearWallet} from '@near-wallet-selector/near-wallet';
import {setupSender} from '@near-wallet-selector/sender';

import {getNetworkPreset, WalletIconType} from './options';

// Same as @near-wallet-selector/{module} id and installed wallets
export type WalletId = 'sender' | 'my-wallet' | 'near-wallet';

export interface NearInstance {
  near: Near;
  wallet: WalletConnection;
  account: Account;
  accountId: string;
}

// TODO: It should be removed after wallet-selector allow acess to wallet.account
// Near is used to get access to account object. Because wallet-selector doesn't expose it
export const createNearInstance = async (
  keyStore: keyStores.BrowserLocalStorageKeyStore,
  walletId?: WalletId | null,
): Promise<NearInstance> => {
  let near: Near;

  switch (walletId) {
    case 'sender':
      near = window.near as unknown as Near;
      break;
    default:
      near = await connect({
        keyStore,
        walletUrl: env.WALLET_URL,
        ...getNetworkPreset(env.NEAR_NETWORK_ID),
        headers: {},
      });
  }

  // Same as in https://github.com/near/wallet-selector/blob/main/packages/my-near-wallet/src/lib/my-near-wallet.ts#L60
  // otherwise , the instance of WalletConnection will not be authorized by us
  // and account will be empty. We need to do this, because near-wallet-selector
  // doesn't expose account
  const appKeyPrefix = 'near_app';
  const wallet = new WalletConnection(near, appKeyPrefix);

  const accountId = wallet.getAccountId();
  const account = wallet.account();

  return {
    near,
    wallet,
    accountId,
    account,
  };
};

export const createWalletSelectorInstance = async () =>
  setupWalletSelector({
    network: env.NEAR_NETWORK_ID,
    debug: true,
    modules: [
      setupNearWallet({
        iconUrl: WalletIconType.NearWallet,
      }),
      setupMyNearWallet({
        iconUrl: WalletIconType.MyNearWallet,
      }),
      setupSender({
        iconUrl: WalletIconType.Sender,
      }),
    ],
  });
