import React from 'react';

import {Modal, ModalProps} from '~/shared/ui/components/modal';

import {AddEmployeeForm} from './add-employee-form';

export const AddEmployeeModal = (modalProps: ModalProps) => (
  <Modal {...modalProps}>
    <AddEmployeeForm />
  </Modal>
);
