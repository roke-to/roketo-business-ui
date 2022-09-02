import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateTreasuryProposalModal} from '~/entities/treasury/ui/create-treasury-proposal-modal';
import {Button} from '~/shared/ui/components/button';
import {useModal} from '~/shared/ui/components/modal';

export const CreateTreasuryProposalButton = () => {
  const {t} = useTranslation('proposal');

  const createProposalModal = useModal();

  return (
    <>
      <Button variant='soft' onClick={createProposalModal.show}>
        {t('createProposal')}
      </Button>
      <CreateTreasuryProposalModal
        isOpen={createProposalModal.isOpen}
        title={t('createProposal')}
        onCloseModal={createProposalModal.hide}
      />
    </>
  );
};
