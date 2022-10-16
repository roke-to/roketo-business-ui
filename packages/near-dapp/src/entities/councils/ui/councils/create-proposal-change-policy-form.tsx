import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {changePolicyProposalForm, changePolicyProposalFx} from '~/entities/governance/model';
import {CreateProposalForm} from '~/entities/proposal/ui/create-proposal-form';
import {$tokenBalances} from '~/entities/treasury/model/treasury';
import {$accountId} from '~/entities/wallet';
import {Modal, ModalProps} from '~/shared/ui/components/modal';

export const CreateProposalChangePolicyForm = (modalProps: ModalProps) => {
  const {t} = useTranslation('proposal');
  const accountId = useStore($accountId);
  const tokenBalances = useStore($tokenBalances);
  const {fields, submit, eachValid, reset} = useForm(changePolicyProposalForm);
  const pending = useStore(changePolicyProposalFx.pending);

  const formOptions = React.useMemo(
    () => [
      {
        value: 'changeQuorum',
        label: t(`createForm.changeQuorum`),
      },
      {
        value: 'addCouncil',
        label: t(`createForm.addCouncil`),
      },
      {
        value: 'removeCouncil',
        label: t(`createForm.removeCouncil`),
      },
    ],
    [t],
  );

  return (
    <Modal {...modalProps} className='min-w-[774px] mobile:min-w-full'>
      <CreateProposalForm
        t={t}
        accountId={accountId}
        tokenBalances={tokenBalances}
        fields={fields}
        submit={submit}
        reset={reset}
        onReset={modalProps.onCloseModal}
        eachValid={eachValid}
        pending={pending}
        formOptions={formOptions}
      />
    </Modal>
  );
};
