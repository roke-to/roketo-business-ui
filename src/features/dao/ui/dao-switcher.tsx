import {useStore} from 'effector-react';
import React from 'react';

import {$currentDaoId, $daoIds, setCurrentDaoId} from '~/entities/dao';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {RadioGroupItem} from '~/shared/ui/components/radio-group';

export const DaoSwitcher = ({className}: {className?: string}) => {
  const daoId = useStore($currentDaoId);
  const userDaos = useStore($daoIds);

  const handleChange = (index: number) => {
    setCurrentDaoId(userDaos[index]);
  };

  return (
    <DropdownMenu label={daoId} size='xxs' variant='clean' className={className}>
      <DropdownContent selected={daoId} handleChange={handleChange} size='xxs' offset='xs'>
        {userDaos.map((id) => (
          <DropdownItem key={id}>
            <RadioGroupItem value={id} label={id} checked={id === daoId} />
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
};
