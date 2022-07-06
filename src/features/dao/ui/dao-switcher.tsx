import React from 'react';

import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';

const DaoList = ['daoName-1', 'daoName-2', 'daoName-3'];

export const DaoSwitcher = () => {
  React.useEffect(() => {
    // load list dao
  }, []);

  return <DropdownMenu values={DaoList} />;
};
