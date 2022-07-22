import React from 'react';

import {Modal, ModalProps} from '~/shared/ui/components/modal';

import {CreateProposalForm} from './create-form';

export const CreateProposalFormModal = (modalProps: ModalProps) => (
  <Modal {...modalProps}>
    <CreateProposalForm />
  </Modal>
);
