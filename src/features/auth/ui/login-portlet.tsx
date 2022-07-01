import {useStore} from 'effector-react';
import React from 'react';

import {$walletSelectorState, walletClicked} from '~/entities/wallet';
import {resolveWalletIcon} from '~/shared/api/near';
import {Button, Col, Heading, Icon, Portlet, Text} from '~/shared/ui/components';

import type {ModuleState} from '@near-wallet-selector/core';

export const LoginPortlet = () => {
  const {modules, selectedWalletId} = useStore($walletSelectorState);

  const handleWalletClick = (module: ModuleState) => () => walletClicked(module);

  return (
    <Portlet gap='xl'>
      <Col gap='sm'>
        <Heading>Join Roketo Business today</Heading>
        <Text>Sign in via NEAR Network to login or create account</Text>
      </Col>
      <Col>
        {modules.map((module: ModuleState) => {
          const {name, description, iconUrl} = module.metadata;
          const selected = module.id === selectedWalletId;
          const WalletIcon = resolveWalletIcon(iconUrl);

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
        <Text color='muted'>After signing up, you'll get access to all features</Text>
      </Col>
    </Portlet>
  );
};
