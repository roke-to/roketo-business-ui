import {useStore} from 'effector-react';
import React from 'react';

import {$isSignedIn, $walletSelector, $walletSelectorState, walletClicked} from '~/entities/wallet';
import {resolveWalletIcon} from '~/shared/api/near';
import {Button, Col, Heading, Icon, Portlet, Text} from '~/shared/ui/components';

import type {ModuleState} from '@near-wallet-selector/core';

export const LoginPortlet = () => {
  const signedIn = useStore($isSignedIn);
  const walletSelector = useStore($walletSelector);
  const walletSelectorState = useStore($walletSelectorState);

  const handleWalletClick = (module: ModuleState) => () => walletClicked(module);

  if (!walletSelector || !walletSelectorState) {
    return null;
  }

  const {modules, selectedWalletId} = walletSelectorState;

  return (
    <Portlet gap='xl'>
      <Col gap='sm'>
        <Heading>Join Roketo Business today ({signedIn ? '1' : '0'})</Heading>
        <Text>Sign in via NEAR Network to login or create account</Text>
      </Col>
      <Col>
        {modules.map((module) => {
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
