import React from 'react';

import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {ReactComponent as Bell} from '~/shared/ui/icons/bell.svg';

const NOTIFICATIONS = ['call'];

export const Notifications = () => (
  <DropdownMenu values={NOTIFICATIONS}>
    <Bell />
  </DropdownMenu>
);
