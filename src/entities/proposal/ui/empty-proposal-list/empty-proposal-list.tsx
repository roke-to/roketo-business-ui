import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$isMobileScreen} from '~/entities/screens';
import {Button} from '~/shared/ui/components/button';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Typography} from '~/shared/ui/components/typography';

import styles from './empty-proposal-list.module.css';

const TextEmptyProposalList = () => {
  const {t} = useTranslation('proposal');

  return (
    <>
      {t('emptyProposalList.firstLine')}
      <br />
      {t('emptyProposalList.secondLine')}
    </>
  );
};

export const EmptyProposalList = ({isDefaultFiltersValue}: {isDefaultFiltersValue?: boolean}) => {
  const {t} = useTranslation('proposal');
  const isMobileWidth = useStore($isMobileScreen);
  const createProposalModal = useModal();

  const text = isDefaultFiltersValue ? <TextEmptyProposalList /> : t('emptySearchProposalList');
  const showCreateButton = isDefaultFiltersValue || isMobileWidth;

  return (
    <div className={styles.container}>
      <Typography as='span' color='muted' align='center'>
        {text}
      </Typography>
      {showCreateButton && (
        <>
          <Button variant='soft' onClick={createProposalModal.show}>
            {t('createProposal')}
          </Button>
          <Modal
            isOpen={createProposalModal.isOpen}
            title={t('createProposal')}
            onCloseModal={createProposalModal.hide}
          />
        </>
      )}
    </div>
  );
};
