import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$walletSelectorState, walletClicked} from '~/entities/wallet';
import {isModuleTypeInjected, resolveWalletIcon, WalletIconType} from '~/shared/api/near';
import {Button} from '~/shared/ui/components/button';
import {ButtonNativeLink} from '~/shared/ui/components/button-link';
import {Col} from '~/shared/ui/components/col';
import {Icon} from '~/shared/ui/components/icon';
import {Portlet} from '~/shared/ui/components/portlet';
import {Typography} from '~/shared/ui/components/typography';

import type {ModuleState} from '@near-wallet-selector/core';

export const LoginPortlet = () => {
  const {t} = useTranslation('auth');
  const {modules, selectedWalletId} = useStore($walletSelectorState);

  const handleWalletClick = (module: ModuleState) => () => walletClicked(module);

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
        </Typography>
      </Col>
    </Portlet>
  );
};
