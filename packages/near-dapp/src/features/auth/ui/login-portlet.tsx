import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

// import {useIntercom} from 'react-use-intercom';
import {$walletSelectorState, walletClicked} from '~/entities/wallet';
import {isModuleTypeInjected, resolveWalletIcon, WalletIconType} from '~/shared/api/near';

import type {ModuleState} from '@near-wallet-selector/core';
import {Button} from '@roketo/core/ui/components/button';
import {ButtonNativeLink} from '@roketo/core/ui/components/button-link';
import {Col} from '@roketo/core/ui/components/col';
import {Icon} from '@roketo/core/ui/components/icon';
import {Portlet} from '@roketo/core/ui/components/portlet';
import {Typography} from '@roketo/core/ui/components/typography';

export const LoginPortlet = () => {
  const {t} = useTranslation('auth');
  const {modules, selectedWalletId} = useStore($walletSelectorState);

  const handleWalletClick = (module: ModuleState) => () => walletClicked(module);

  // TODO@extg: Setup intetcom RB-312
  // const {boot, show} = useIntercom();
  // const handleShowHelp = () => {
  //   boot();
  //   show();
  // };

  return (
    <Portlet gap='xl' className='pb-12 mobile:pb-8'>
      <Col gap='sm'>
        <Typography font='heading' className='text-center'>
          {t('title')}
        </Typography>
        <Typography as='span'>{t('subTitle')}</Typography>
      </Col>
      <Col>
        {modules.map((module: ModuleState) => {
          const {name, description, iconUrl, available} = module.metadata;
          const selected = module.id === selectedWalletId;
          const WalletIcon = resolveWalletIcon(iconUrl as WalletIconType);

          if (!available && isModuleTypeInjected(module)) {
            return (
              <ButtonNativeLink
                as='a'
                href={module.metadata.downloadUrl}
                target='_blank'
                key={module.id}
                variant='soft'
                startIcon={<Icon as={WalletIcon} />}
                title={description || ''}
              >
                {name}
              </ButtonNativeLink>
            );
          }

          return (
            <Button
              key={module.id}
              variant='soft'
              startIcon={<Icon as={WalletIcon} />}
              disabled={selected}
              onClick={selected ? undefined : handleWalletClick(module)}
              title={description || ''}
            >
              {name} {selected ? '*' : ''}
            </Button>
          );
        })}
        <Typography as='p' color='muted' className='text-center'>
          {t('footer')}
          {/* TODO@extg: Setup intetcom RB-312 */}
          {/* <button
            type='button'
            className='text-blue-textDefault cursor-pointer'
            onClick={handleShowHelp}
          >
            Leave contact info
          </button>
          , personal manager will reach out and assist in optimizing your Web3 financials with
          Roketo Business */}
        </Typography>
      </Col>
    </Portlet>
  );
};
