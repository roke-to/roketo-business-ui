import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateProposalTransferFormModal} from '~/entities/treasury/ui/create-proposal-transfer-form-modal';
import {Button} from '~/shared/ui/components/button';
import {useModal} from '~/shared/ui/components/modal';

export const CreateProposalTransferButton = () => {
  const {t} = useTranslation('proposal');

  const createProposalModal = useModal();

  return (
    <>
      <Button variant='soft' onClick={createProposalModal.show}>
        {t('createProposal')}
      </Button>
      <CreateProposalTransferFormModal
        isOpen={createProposalModal.isOpen}
        title={t('createProposal')}
        onCloseModal={createProposalModal.hide}
      />
    </>
  );
};
