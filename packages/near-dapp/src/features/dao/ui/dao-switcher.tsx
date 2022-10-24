import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import ReactModal from 'react-modal';

import {$daoIds} from '~/entities/dao';
import {$currentDaoId, setCurrentDaoId} from '~/entities/wallet';
import {DaoNewModal} from '~/features/dao/ui/dao-new-modal';
import {Button} from 'ui/components/button';
import {DropdownMenu} from 'ui/components/dropdown-menu';
import {DropdownContent} from 'ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from 'ui/components/dropdown-menu/dropdown-item';
import {useModal} from 'ui/components/modal';
import {RadioGroupItem} from 'ui/components/radio-group';

import styles from './dao-switcher.module.css';

const modalRef = React.createRef<ReactModal>();

const getIgnoreItems = () => {
  if (modalRef.current?.portal) {
    return [modalRef.current.portal.content];
  }
  return [];
};

export const DaoSwitcher = ({className}: {className?: string}) => {
  const {t} = useTranslation('dao');
  const daoId = useStore($currentDaoId);
  const userDaos = useStore($daoIds);

  const handleChange = (index: number) => {
    setCurrentDaoId(userDaos[index]);
  };

  const createDaoModal = useModal();

  return (
    <DropdownMenu
      label={daoId}
      data-qa='daoDropdownMenu'
      size='xxs'
      variant='clean'
      getIgnoreItems={getIgnoreItems}
      className={className}
    >
      <DropdownContent
        selected={daoId}
        handleChange={handleChange}
        size='xxs'
        offset='xs'
        className='max-w-full'
      >
        {userDaos.map((id) => (
          <DropdownItem key={id}>
            <RadioGroupItem value={id} label={id} checked={id === daoId} />
          </DropdownItem>
        ))}

        <Button variant='soft' onClick={createDaoModal.show} className={styles.createDao}>
          {t('daoInit.createDao')}
        </Button>
        <DaoNewModal
          isOpen={createDaoModal.isOpen}
          onCloseModal={createDaoModal.hide}
          ref={modalRef}
        />
      </DropdownContent>
    </DropdownMenu>
  );
};
