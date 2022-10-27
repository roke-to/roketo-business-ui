import React from 'react';

import {WalletAdapterNetwork, WalletError} from '@solana/wallet-adapter-base';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {PhantomWalletAdapter, SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import {clusterApiUrl} from '@solana/web3.js';

export const WalletContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  const wallets = React.useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  const onError = React.useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>{children}</>
      </WalletProvider>
    </ConnectionProvider>
  );
};
