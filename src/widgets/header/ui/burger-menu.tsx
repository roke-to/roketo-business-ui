import {useStore} from 'effector-react';
import React from 'react';

import {$sideBarState, setSideBarState} from '~/entities/menu';
import {IconButton} from '~/shared/ui/components/icon-button';
import {ReactComponent as Menu} from '~/shared/ui/icons/menu.svg';

import styles from './header-container.module.css';

export const BurgerMenu = () => {
  const sideBarState = useStore($sideBarState);

  return (
    <IconButton
      variant='clean'
      size='sm'
      className={styles.burgerMenu}
      onClick={() => setSideBarState({isOpen: !sideBarState.isOpen})}
    >
      <Menu />
    </IconButton>
  );
};
