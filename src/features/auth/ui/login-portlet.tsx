import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$walletSelectorState, walletClicked} from '~/entities/wallet';
import {resolveWalletIcon} from '~/shared/api/near';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Heading} from '~/shared/ui/components/heading';
import {Icon} from '~/shared/ui/components/icon';
import {Portlet} from '~/shared/ui/components/portlet';
import {Text} from '~/shared/ui/components/text';

import type {ModuleState} from '@near-wallet-selector/core';

export const LoginPortlet = () => {
  const {t} = useTranslation('auth');
  const {modules, selectedWalletId} = useStore($walletSelectorState);

  const handleWalletClick = (module: ModuleState) => () => walletClicked(module);

  return (
    <Portlet gap='xl'>
      <Col gap='sm'>
        <Heading>{t('title')}</Heading>
        <Text>{t('subTitle')}</Text>
      </Col>
      <Col>
        {modules.map((module: ModuleState) => {
          // @ts-expect-error
          const {name, description, iconUrl, available, downloadUrl} = module.metadata;
          const selected = module.id === selectedWalletId;
          const WalletIcon = resolveWalletIcon(iconUrl);

          if (!available) {
            return (
              <Button
                as='a'
                // @ts-expect-error
                href={downloadUrl}
                target='_blank'
                key={module.id}
                variant='soft'
                startIcon={<Icon as={WalletIcon} />}
                title={description || ''}
              >
                {name}
              </Button>
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
        <Text color='muted'>{t('footer')}</Text>
      </Col>
    </Portlet>
  );
};
