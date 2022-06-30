import {
  connect,
  ConnectedWalletAccount,
  keyStores,
  Near,
  transactions,
  WalletConnection,
} from 'near-api-js';
import type {Action as NearAction} from 'near-api-js/lib/transaction';

import {env} from '~/shared/config/env';
import {ReactComponent as MyNearWalletLogo} from '~/shared/ui/icons/my-near-wallet.svg';
import {ReactComponent as NearWalletLogo} from '~/shared/ui/icons/near-wallet.svg';

import {NetworkId, Action as SelectorAction, setupWalletSelector} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
import {setupNearWallet} from '@near-wallet-selector/near-wallet';
import {setupSender} from '@near-wallet-selector/sender';

import type {NearAuth, TransactionMediator} from '../types';

export type NearInstance = {
  near: Near;
  auth: NearAuth;
  walletType: 'near' | 'sender';
};

async function createSenderWalletInstance(): Promise<NearInstance | null> {
  if (window.near) {
    const walletSelector = await setupWalletSelector({
      network: env.NEAR_NETWORK_ID as NetworkId,
      modules: [setupSender()],
    });
    const sdrWallet = await walletSelector.wallet('sender');
    console.log('sdrWallet', sdrWallet);
    const senderNear = window.near;
    // @ts-expect-error not typed method
    const accSnd: ConnectedWalletAccount = senderNear.account();
    const accountIdSnd = senderNear.getAccountId();
    let balanceSnd;
    if (accountIdSnd) {
      balanceSnd = await accSnd.getAccountBalance();
    }
    if (accSnd && accSnd.connection.networkId !== env.NEAR_NETWORK_ID) {
      throw Error(
        `wrong account network: ${accSnd.connection.networkId} need ${env.NEAR_NETWORK_ID}`,
      );
    }
    const senderTransactionMediator: TransactionMediator<SelectorAction> = {
      functionCall(methodName, args, gas, deposit) {
        return {type: 'FunctionCall', params: {methodName, args, gas, deposit}};
      },
      signAndSendTransaction({receiverId, actions, walletCallbackUrl}) {
        return sdrWallet.signAndSendTransaction({
          receiverId,
          // @ts-expect-error
          walletCallbackUrl,
          actions,
        });
      },
    };
    return {
      walletType: 'sender',
      auth: {
        balance: balanceSnd,
        account: accSnd,
        signedIn: !!accountIdSnd,
        accountId: accountIdSnd ?? '',
        async login() {
          await sdrWallet.signIn({contractId: env.ROKETO_CONTRACT_NAME, derivationPaths: []});
        },
        async logout() {
          await sdrWallet.signOut();
        },
        signAndSendTransaction({receiverId, actions, walletCallbackUrl}) {
          return sdrWallet.signAndSendTransaction({
            receiverId,
            // @ts-expect-error
            walletCallbackUrl,
            actions: actions.map((action) => ({
              type: 'FunctionCall',
              params: action.functionCall,
            })),
          });
        },
        transactionMediator: senderTransactionMediator,
      },
      // @ts-expect-error sender near object is not fully typed
      near: senderNear,
    };
  }
  return null;
}

async function createNearWalletInstance(): Promise<NearInstance> {
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();
  const near = await connect({
    nodeUrl: env.NEAR_NODE_URL,
    walletUrl: env.WALLET_URL,
    networkId: env.NEAR_NETWORK_ID,
    keyStore,
    headers: {},
  });
  const walletConnection = new WalletConnection(near, env.ROKETO_CONTRACT_NAME);

  const accountId = walletConnection.getAccountId();
  const account = walletConnection.account();
  let balance;
  if (accountId) {
    balance = await account.getAccountBalance();
  }

  const nearTransactionMediator: TransactionMediator<NearAction> = {
    functionCall(methodName, args, gas, deposit) {
      return transactions.functionCall(methodName, args, gas, deposit);
    },
    signAndSendTransaction(params) {
      // @ts-expect-error signAndSendTransaction is protected
      return account.signAndSendTransaction(params);
    },
  };
  return {
    walletType: 'near',
    near,
    auth: {
      balance,
      account,
      signedIn: !!accountId,
      accountId,
      async login() {
        const appTitle = 'Roketo Token Streaming Service';
        await walletConnection.requestSignIn(env.ROKETO_CONTRACT_NAME, appTitle);
      },
      async logout() {
        await walletConnection.signOut();
      },
      signAndSendTransaction(params) {
        // @ts-expect-error signAndSendTransaction is protected
        return account.signAndSendTransaction(params);
      },
      transactionMediator: nearTransactionMediator,
    },
  };
}

export async function createNearInstance(
  walletType: 'any' | 'near' | 'sender' = 'any',
): Promise<NearInstance | null> {
  switch (walletType) {
    case 'sender': {
      const result = await createSenderWalletInstance();
      if (!result) throw Error('Sender wallet is not installed');
      return result;
    }
    case 'near':
      return createNearWalletInstance();
    case 'any':
    default: {
      const nearWallet = await createNearWalletInstance();
      if (!nearWallet.auth.signedIn) {
        const senderWallet = await createSenderWalletInstance();
        return senderWallet ?? nearWallet;
      }
      return nearWallet;
    }
  }
}

export const initWalletSelector = async () => {
  const selector = await setupWalletSelector({
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
  // TODO: remove
  // @ts-expect-error for debug
  window.selector = selector;

  return selector;
};

const walletIcons = {
  MyNearWalletLogo,
  NearWalletLogo,
};

export const resolveWalletIcon = (iconUrl: string) =>
  walletIcons[iconUrl as keyof typeof walletIcons];
