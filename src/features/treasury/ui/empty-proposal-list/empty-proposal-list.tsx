import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$treasurySelectedProposalKind, $treasurySelectedProposalStatus} from '~/entities/treasury';
import {theme} from '~/shared/config/theme';
import {useMediaQuery} from '~/shared/hook/useMediaQuery';
import {Button} from '~/shared/ui/components/button';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Typography} from '~/shared/ui/components/typography';

import styles from './empty-proposal-list.module.css';

const TextEmptyProposalList = () => {
  const {t} = useTranslation('treasury');

  return (
    <>
      {t('emptyProposalList.firstLine')}
      <br />
      {t('emptyProposalList.secondLine')}
    </>
  );
};

export const EmptyProposalList = () => {
  const {t} = useTranslation('treasury');
  const isMobileWidth = useMediaQuery(`(max-width: ${theme.screens.tablet})`);
  const createProposalModal = useModal();

  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);

  const isDefaultFiltersValue =
    treasurySelectedProposalKind === 'Transfer' && treasurySelectedProposalStatus === 'all';

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
