import {useStore} from 'effector-react';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useIntercom} from 'react-use-intercom';

import {$walletSelectorState, walletClicked} from '~/entities/wallet';
import {isModuleTypeInjected, resolveWalletIcon, WalletIconType} from '~/shared/api/near';

import type {ModuleState} from '@near-wallet-selector/core';
import {Button} from '@roketo/core/ui/components/button';
import {ButtonNativeLink} from '@roketo/core/ui/components/button-link';
import {Col} from '@roketo/core/ui/components/col';
import {Icon} from '@roketo/core/ui/components/icon';
import {Line} from '@roketo/core/ui/components/line';
import {Portlet} from '@roketo/core/ui/components/portlet';
import {Typography} from '@roketo/core/ui/components/typography';

export const LoginPortlet = () => {
  const {t} = useTranslation('auth');
  const {modules, selectedWalletId} = useStore($walletSelectorState);
  const {boot, showNewMessages} = useIntercom();

  const handleWalletClick = (module: ModuleState) => () => walletClicked(module);

  const handleShowHelp = () => {
    boot();
    showNewMessages('Hello! I have a question your product. Can you help me?');
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
        <Line className='my-4' />
        <Typography as='p' color='muted' className='text-left'>
          <Trans
            ns='auth'
            i18nKey='leaveContactInfo'
            components={{
              button: (
                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                <button
                  type='button'
                  className='text-blue-textDefault cursor-pointer'
                  onClick={handleShowHelp}
                />
              ),
            }}
          />
        </Typography>
      </Col>
    </Portlet>
  );
};
