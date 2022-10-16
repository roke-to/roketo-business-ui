import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateProposalChangePolicyForm} from '~/entities/councils/ui/councils/create-proposal-change-policy-form';
import {openChangePolicyProposalForm} from '~/entities/governance/model';
import {Button, ButtonProps} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {useModal} from '~/shared/ui/components/modal';

import styles from './councils.module.css';

export const ChangePolicyButton = (props: Omit<ButtonProps, 'variant' | 'onClick'>) => {
  const {t} = useTranslation('proposal');
  const changePolicyModal = useModal();

  const handleOpenModalClick = () => {
    openChangePolicyProposalForm();
    changePolicyModal.show();
  };

  return (
    <Col className={styles.changePolicyButton}>
      <Button {...props} variant='soft' onClick={handleOpenModalClick}>
        {t('createForm.changePolicy')}
      </Button>
      <CreateProposalChangePolicyForm
        isOpen={changePolicyModal.isOpen}
        title={t('createForm.changePolicy')}
        onCloseModal={changePolicyModal.hide}
      />
    </Col>
  );
};
