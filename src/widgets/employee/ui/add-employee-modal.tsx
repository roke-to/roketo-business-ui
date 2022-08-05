import React from 'react';

import {Modal, ModalProps} from '~/shared/ui/components/modal';

import {AddEmployeeForm} from './add-employee-form';

export const AddEmployeeModal = (modalProps: ModalProps) => (
  // TODO: TBD react/jsx-props-no-spreading кажется стоит отключить
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Modal {...modalProps}>
    <AddEmployeeForm />
  </Modal>
);
