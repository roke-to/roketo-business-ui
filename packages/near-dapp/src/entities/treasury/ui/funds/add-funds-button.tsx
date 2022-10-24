import React from 'react';

import {AddFundsModal} from '~/entities/treasury/ui/funds/add-funds-modal';
import {IconButton} from 'ui/components/icon-button';
import {useModal} from 'ui/components/modal';
import {ReactComponent as Plus} from 'ui/icons/plus.svg';

export const AddFundsButton = () => {
  const addFundsModal = useModal();
  return (
    <>
      <IconButton size='sm' className='ml-3' onClick={addFundsModal.show}>
        <Plus className='w-[16px] h-[16px] scale-100 translate-x-0 translate-y-0 skew-x-0 skew-y-0' />
      </IconButton>
      <AddFundsModal isOpen={addFundsModal.isOpen} onCloseModal={addFundsModal.hide} />
    </>
  );
};
