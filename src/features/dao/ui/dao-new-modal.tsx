import React from 'react';
import ReactModal from 'react-modal';

import {DaoNew} from '~/features/dao/ui/dao-new';
import {Modal, ModalProps} from '~/shared/ui/components/modal';

export const DaoNewModal = React.forwardRef<ReactModal, ModalProps>((modalProps, ref) => (
  <Modal {...modalProps} ref={ref}>
    <DaoNew />
  </Modal>
));
