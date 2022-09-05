import {
  connect,
  ConnectedWalletAccount,
  keyStores,
  Near,
  transactions,
  WalletConnection,
} from 'near-api-js';
import {AccountBalance} from 'near-api-js/lib/account';
import type {Action as NearAction} from 'near-api-js/lib/transaction';

import {TransactionMediator} from '~/shared/api/types';
import {env} from '~/shared/config/env';

import {
  Action as SelectorAction,
  setupWalletSelector,
  Wallet,
  WalletSelector,
} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
import {setupNearWallet} from '@near-wallet-selector/near-wallet';
import {setupSender} from '@near-wallet-selector/sender';

import {getNetworkPreset, WalletIconType} from './options';

// Same as @near-wallet-selector/{module} id and installed wallets
export type WalletId = 'sender' | 'my-wallet' | 'near-wallet';

export interface NearInstance {
  near: Near;
  wallet: WalletConnection;
  account: ConnectedWalletAccount;
  accountId: string;
  balance?: AccountBalance;
  login: () => void;
  logout: () => void;
  transactionMediator: TransactionMediator;
}

const getSenderTransactionMediator = (sdrWallet: Wallet): TransactionMediator<SelectorAction> => ({
  functionCall(methodName, args, gas, deposit) {
    return {type: 'FunctionCall', params: {methodName, args, gas, deposit}};
  },
  signAndSendTransaction({receiverId, actions, walletCallbackUrl}) {
    return sdrWallet?.signAndSendTransaction({
      receiverId,
      // @ts-expect-error
      walletCallbackUrl,
      actions,
    });
  },
});

const getNearTransactionMediator = (
  account: ConnectedWalletAccount,
): TransactionMediator<NearAction> => ({
  functionCall(methodName, args, gas, deposit) {
    // @ts-expect-error gas should be BN
    return transactions.functionCall(methodName, args, gas, deposit);
  },
  signAndSendTransaction(params) {
    // @ts-expect-error signAndSendTransaction is protected
    return account.signAndSendTransaction(params);
  },
});

// TODO: It should be removed after wallet-selector allow acess to wallet.account
// Near is used to get access to account object. Because wallet-selector doesn't expose it
export const createNearInstance = async (
  keyStore: keyStores.BrowserLocalStorageKeyStore,
  walletSelector: WalletSelector | null,
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
      break;
  }

  // Same as in https://github.com/near/wallet-selector/blob/main/packages/my-near-wallet/src/lib/my-near-wallet.ts#L60
  // otherwise , the instance of WalletConnection will not be authorized by us
  // and account will be empty. We need to do this, because near-wallet-selector
  // doesn't expose account
  const appKeyPrefix = 'near_app';
  const wallet = new WalletConnection(near, appKeyPrefix);

  const accountId = wallet.getAccountId();
  const account: ConnectedWalletAccount = wallet.account();
  let balance;
  if (accountId) {
    balance = await account.getAccountBalance();
  }

  let transactionMediator;
  let login: () => void;
  let logout: () => void;

  switch (walletId) {
    case 'sender': {
      const sdrWallet = await walletSelector!.wallet('sender');
      console.log('sdrWallet', sdrWallet);

      login = async () => {
        await sdrWallet.signIn({
          contractId: env.ROKETO_CONTRACT_NAME,
          accounts: [],
          methodNames: ['start_stream', 'pause_stream', 'stop_stream', 'withdraw'],
        });
        localStorage.setItem('profileType', 'sender');
      };
      logout = async () => {
        localStorage.setItem('profileType', 'none');
        await sdrWallet.signOut();
      };

      transactionMediator = getSenderTransactionMediator(sdrWallet);
      break;
    }
    default: {
      login = async () => {
        localStorage.setItem('profileType', wallet._walletBaseUrl);
        const appTitle = 'Roketo Token Streaming Service';
        // @ts-expect-error one argument
        await wallet.requestSignIn(env.ROKETO_CONTRACT_NAME, appTitle);
      };
      logout = async () => {
        localStorage.setItem('profileType', 'none');
        await wallet.signOut();
      };
      transactionMediator = getNearTransactionMediator(account);
      break;
    }
  }

  return {
    near,
    wallet,
    accountId,
    account,
    balance,
    login,
    logout,
    transactionMediator,
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
