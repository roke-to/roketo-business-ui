import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$currentDaoId, $daoIds, setCurrentDaoId} from '~/entities/dao';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {RadioGroupItem} from '~/shared/ui/components/radio-group';

import styles from './dao-switcher.module.css';

export const DaoSwitcher = ({className}: {className?: string}) => {
  const {t} = useTranslation('dao');
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

        {/* @ts-expect-error */}
        <Button as={Link} to={ROUTES.daoNew.path} variant='soft' className={styles.createDao}>
          {t('daoInit.createDao')}
        </Button>
      </DropdownContent>
    </DropdownMenu>
  );
};
