import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateProposalChangePolicyForm} from '~/entities/councils/ui/councils/create-proposal-change-policy-form';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {useModal} from '~/shared/ui/components/modal';

import styles from './councils.module.css';

export const ChangePolicyButton = () => {
  const {t} = useTranslation('proposal');
  const changePolicyModal = useModal();

  return (
    <Col className={styles.changePolicyButton}>
      <Button variant='soft' onClick={changePolicyModal.show}>
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
