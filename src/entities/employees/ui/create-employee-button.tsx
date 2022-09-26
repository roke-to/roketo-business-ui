import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import * as employeeModel from '~/entities/employee/model/employee-model';
import {Button, ButtonProps} from '~/shared/ui/components/button';

import {CreateEmployeeModal} from './create-employee-modal';

export const CreateEmployeeButton: React.FC<Omit<ButtonProps, 'variant' | 'onClick'>> = (props) => {
  const {t} = useTranslation('employees');
  const isModalOpen = useStore(employeeModel.$isCreateEmployeeModalOpen);

  return (
    <>
      <Button
        {...props}
        variant='soft'
        // @ts-expect-error
        onClick={employeeModel.openCreateEmployeeModal}
      >
        {t('createEmployee.button')}
      </Button>
      <CreateEmployeeModal
        isOpen={isModalOpen}
        title={t('createEmployee.modal.title')}
        onCloseModal={employeeModel.closeCreateEmployeeModal}
      />
    </>
  );
};
