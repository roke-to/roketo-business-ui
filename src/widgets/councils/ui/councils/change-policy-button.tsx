import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$currentDao} from '~/entities/dao';
import {changePolicyProposalForm} from '~/entities/governance';
import {getQuorum} from '~/shared/lib/getQuorum';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {useModal} from '~/shared/ui/components/modal';
import styles from '~/widgets/councils/ui/councils/councils.module.css';
import {CreateProposalChangePolicyForm} from '~/widgets/councils/ui/councils/create-proposal-change-policy-form';

const DEFAULT_CURRENT_DAO = {policy: {defaultVotePolicy: {ratio: []}}, council: []};

export const ChangePolicyButton = () => {
  const {t} = useTranslation('proposal');

  const changePolicyModal = useModal();
  const currentDao = useStore($currentDao) || DEFAULT_CURRENT_DAO;

  const {
    policy: {
      defaultVotePolicy: {ratio},
    },
  } = currentDao;

  const quorum = getQuorum(ratio);

  const initializedChangePolicyProposalForm = changePolicyProposalForm({
    quorum,
    councilList: currentDao.council || [],
  });

  return (
    <Col className={styles.changePolicyButton}>
      <Button variant='soft' onClick={changePolicyModal.show}>
        {t('createForm.changePolicy')}
      </Button>
      <CreateProposalChangePolicyForm
        isOpen={changePolicyModal.isOpen}
        title={t('createForm.changePolicy')}
        onCloseModal={changePolicyModal.hide}
        initializedChangePolicyProposalForm={initializedChangePolicyProposalForm}
      />
    </Col>
  );
};
