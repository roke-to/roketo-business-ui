import {useStore} from 'effector-react/effector-react.cjs';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$treasurySelectedProposalKind, $treasurySelectedProposalStatus} from '~/entities/treasury';
import {Button} from '~/shared/ui/components/button';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Typography} from '~/shared/ui/components/typography';

import styles from './empty-proposal-list.module.css';

export const EmptyProposalList = () => {
  const {t} = useTranslation('treasury');
  const createProposalModal = useModal();

  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);

  const isDefaultFiltersValue =
    treasurySelectedProposalKind === 'Transfer' && treasurySelectedProposalStatus === 'all';

  const text = isDefaultFiltersValue ? t('emptyProposalList') : t('emptySearchProposalList');

  return (
    <div className={styles.container}>
      <Typography as='span' color='muted'>
        {text}
      </Typography>
      {isDefaultFiltersValue && (
        <>
          <Button variant='soft' onClick={createProposalModal.show}>
            {t('list.createProposal')}
          </Button>
          <Modal
            isOpen={createProposalModal.isOpen}
            title={t('list.createProposal')}
            onCloseModal={createProposalModal.hide}
          />
        </>
      )}
    </div>
  );
};
