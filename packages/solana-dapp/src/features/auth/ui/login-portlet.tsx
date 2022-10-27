import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$wallets, changeSelectedWalletName} from '~/entities/wallet';

import {Button} from '@roketo/core/ui/components/button';
import {Col} from '@roketo/core/ui/components/col';
import {Portlet} from '@roketo/core/ui/components/portlet';
import {Typography} from '@roketo/core/ui/components/typography';
// import {useWallet} from "@solana/wallet-adapter-react";
import {WalletName, WalletReadyState} from '@solana/wallet-adapter-base';

export const LoginPortlet = () => {
  const {t} = useTranslation('auth');

  // const {wallets, select} = useWallet();
  const wallets = useStore($wallets);

  const handleWalletClick = (walletName: WalletName) => {
    changeSelectedWalletName(walletName);
  };

  return (
    <Portlet gap='xl' className='pb-12 mobile:pb-8'>
      <Col gap='sm'>
        <Typography font='heading' className='text-center'>
          {t('title')}
        </Typography>
        <Typography as='span'>{t('subTitle')}</Typography>
      </Col>

      <Col>
        {wallets.map((wallet) => (
          <Button
            key={wallet.adapter.name}
            onClick={() => handleWalletClick(wallet.adapter.name)}
            gap={1}
          >
            {wallet.adapter.name}
            {wallet.readyState === WalletReadyState.Installed && <span>Detected</span>}
          </Button>
        ))}
      </Col>

      <Col>
        <Typography as='p' color='muted' className='text-center'>
          {t('footer')}
        </Typography>
      </Col>
    </Portlet>
  );
};
