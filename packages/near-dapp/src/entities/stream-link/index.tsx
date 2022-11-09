import React from 'react';

import {getStreamLink} from '~/shared/config/routes';

import {ButtonNativeLink} from '@roketo/core/ui/components/button-link';

export const StreamLink = ({streamId}: {streamId: string | null}) => {
  if (!streamId) return null;
  const link = getStreamLink(streamId);
  return (
    <ButtonNativeLink
      href={link}
      variant='clean'
      target='_blank'
      rel='noopener noreferrer'
      className='px-1 text-blue-textDefault'
    >
      {streamId.slice(0, 4)}...
      {streamId.slice(-4)}
    </ButtonNativeLink>
  );
};
