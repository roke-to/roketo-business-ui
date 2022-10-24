import React from 'react';

import {IconButton} from 'ui/components/icon-button';
import {ReactComponent as Bell} from 'ui/icons/bell.svg';

export const Notifications = () => (
  <IconButton size='sm' variant='clean' className='invisible'>
    <Bell />
  </IconButton>
);
