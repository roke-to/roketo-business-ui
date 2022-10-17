import React from 'react';
import {useTranslation} from 'react-i18next';

import {Button, ButtonProps} from '~/shared/ui/components/button';
import {useModal} from '~/shared/ui/components/modal';

import {CreateEmployeeModal} from './create-employee-modal';

export const CreateEmployeeButton: React.FC<Omit<ButtonProps, 'variant' | 'onClick'>> = (props) => {
  const {t} = useTranslation('employees');
  const createEmployeeModal = useModal();

  return (
    <>
      <Button
        {...props}
        variant='soft'
        // TODO fix typings
        onClick={createEmployeeModal.show}
      >
        {t('createEmployee.button')}
      </Button>
      <CreateEmployeeModal
        isOpen={createEmployeeModal.isOpen}
        title={t('createEmployee.modal.title')}
        onCloseModal={createEmployeeModal.hide}
      />
    </>
  );
};
