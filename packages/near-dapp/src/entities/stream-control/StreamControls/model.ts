import {combine} from 'effector';

import {
  pauseStream as pauseStreamFn,
  startStream as startStreamFn,
  stopStream as stopStreamFn,
} from '~/entities/streams/lib';
import {$currentDaoId, $near, $walletSelector} from '~/entities/wallet';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';

import {createProtectedEffect} from '@roketo/core/roketo/protectedEffect';

const returnPath = `${window.location.origin}${ROUTES.streamProposals.path}`;

const modifyStreamFx = createProtectedEffect({
  source: combine($near, $currentDaoId, $walletSelector, (near, currentDaoId, walletSelector) =>
    !!near && !!currentDaoId && !!walletSelector ? {near, currentDaoId, walletSelector} : null,
  ),
  async fn(
    {near, currentDaoId, walletSelector},
    {command, streamId}: {command: 'start' | 'stop' | 'pause'; streamId: string},
  ) {
    const {login} = near;

    const creator = () => {
      switch (command) {
        case 'start':
          return startStreamFn({
            streamId,
            roketoContractName: env.ROKETO_CONTRACT_NAME,
            currentDaoId,
            walletSelector,
            callbackUrl: returnPath,
          });
        case 'pause':
          return pauseStreamFn({
            streamId,
            roketoContractName: env.ROKETO_CONTRACT_NAME,
            currentDaoId,
            walletSelector,
            callbackUrl: returnPath,
          });
        case 'stop':
          return stopStreamFn({
            streamId,
            roketoContractName: env.ROKETO_CONTRACT_NAME,
            currentDaoId,
            walletSelector,
            callbackUrl: returnPath,
          });
        default:
          return null;
      }
    };
    try {
      await creator();
    } catch (error) {
      if ((error as Error).message === 'Wallet not signed in') {
        await login();
        await creator();
      } else {
        throw error;
      }
    }
  },
});

export const $loading = modifyStreamFx.pending;
export const startStream = modifyStreamFx.prepend((streamId: string) => ({
  streamId,
  command: 'start',
}));
export const pauseStream = modifyStreamFx.prepend((streamId: string) => ({
  streamId,
  command: 'pause',
}));
export const stopStream = modifyStreamFx.prepend((streamId: string) => ({
  streamId,
  command: 'stop',
}));

modifyStreamFx.finally.watch((upd) => {
  console.log('modifyStreamFx', upd);
});
