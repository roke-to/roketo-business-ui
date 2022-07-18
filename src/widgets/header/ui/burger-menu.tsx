import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState, setSideBarState} from '~/entities/menu';
import {Button} from '~/shared/ui/components/button';
import {ReactComponent as Menu} from '~/shared/ui/icons/menu.svg';

export const BurgerMenu = () => {
  const sideBarState = useStore($sideBarState);

  return (
    <Button
      variant='clean'
      startIcon={<Menu />}
      onClick={() => setSideBarState({isOpen: !sideBarState.isOpen})}
    />
  );
};
