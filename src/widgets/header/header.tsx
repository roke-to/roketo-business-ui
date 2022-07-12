import React from 'react';

import {DaoSwitcher} from '~/features/dao/ui/dao-switcher';
import {Notifications} from '~/features/notifications/ui';
import {HeaderContainer} from '~/widgets/header/ui';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header: React.FC<HeaderProps> = () => (
  <HeaderContainer>
    <DaoSwitcher />
    <Notifications />
  </HeaderContainer>
);