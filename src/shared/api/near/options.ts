import {ReactComponent as MyNearWalletLogo} from '~/shared/ui/icons/my-near-wallet.svg';
import {ReactComponent as NearWalletLogo} from '~/shared/ui/icons/near-wallet.svg';
import {ReactComponent as SenderLogo} from '~/shared/ui/icons/sender.svg';

export type NetworkId = 'mainnet' | 'testnet';

export interface Network {
  networkId: string;
  nodeUrl: string;
  helperUrl: string;
  explorerUrl: string;
  indexerUrl: string;
}

// https://github.com/near/wallet-selector/blob/587999292343ec1dff7e8d0e656755bd53e42d04/packages/core/src/lib/options.ts#L5
export const getNetworkPreset = (networkId: NetworkId): Network => {
  switch (networkId) {
    case 'mainnet':
      return {
        networkId,
        nodeUrl: 'https://rpc.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.near.org',
        indexerUrl: 'https://api.kitwallet.app',
      };
    case 'testnet':
      return {
        networkId,
        nodeUrl: 'https://rpc.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        indexerUrl: 'https://testnet-api.kitwallet.app',
      };
    default:
      throw Error(`Failed to find config for: '${networkId}'`);
  }
};

export enum WalletIconType {
  MyNearWallet = 'MyNearWallet',
  NearWallet = 'NearWallet',
  Sender = 'Sender',
}

const walletIcons = {
  [WalletIconType.MyNearWallet]: MyNearWalletLogo,
  [WalletIconType.NearWallet]: NearWalletLogo,
  [WalletIconType.Sender]: SenderLogo,
};

export const resolveWalletIcon = (iconUrl: WalletIconType) => walletIcons[iconUrl];
