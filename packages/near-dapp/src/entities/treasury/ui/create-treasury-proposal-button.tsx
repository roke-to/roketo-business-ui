import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateTreasuryProposalModal} from '~/entities/treasury/ui/create-treasury-proposal-modal';
import {Button, ButtonProps} from 'ui/components/button';
import {useModal} from 'ui/components/modal';

export const CreateTreasuryProposalButton: React.FC<
  Omit<ButtonProps, 'variant' | 'onClick'> & {onClick?: () => void}
> = ({children, onClick, ...props}) => {
  const {t} = useTranslation('proposal');

  const createProposalModal = useModal();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    createProposalModal.show();
  };

  return (
    <>
      <Button {...props} variant='soft' onClick={handleClick}>
        {children || t('createProposal')}
      </Button>
      <CreateTreasuryProposalModal
        isOpen={createProposalModal.isOpen}
        title={t('createProposal')}
        onCloseModal={createProposalModal.hide}
      />
    </>
  );
};
