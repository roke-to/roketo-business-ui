import React from 'react';

import {IconButton} from '@roketo/core/ui/components/icon-button';
import {ReactComponent as Bell} from '@roketo/core/ui/icons/bell.svg';

export const Notifications = () => (
  <IconButton size='sm' variant='clean' className='invisible'>
    <Bell />
  </IconButton>
);
