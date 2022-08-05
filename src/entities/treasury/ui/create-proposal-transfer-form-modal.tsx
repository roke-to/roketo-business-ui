import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {createProposalForm, createProposalFx} from '~/entities/treasury/model/treasury';
import {Modal, ModalProps} from '~/shared/ui/components/modal';
import {CreateProposalForm} from '~/widgets/proposal/ui/create-form-modal/create-proposal-form';

export const CreateProposalTransferFormModal = (modalProps: ModalProps) => {
  const {t} = useTranslation('proposal');
  const {fields, submit, eachValid} = useForm(createProposalForm);
  const pending = useStore(createProposalFx.pending);

  const formOptions = React.useMemo(
    () => [
      {
        value: 'transfer',
        label: t(`createForm.transfer`),
      },
      {
        value: 'transferNftMintbase',
        label: t(`createForm.transferNftMintbase`),
      },
      {
        value: 'transferNftParas',
        label: t(`createForm.transferNftParas`),
      },
      {
        value: 'functionalCall',
        label: t(`createForm.functionalCall`),
      },
    ],
    [t],
  );

  return (
    <Modal {...modalProps}>
      <CreateProposalForm
        t={t}
        fields={fields}
        submit={submit}
        eachValid={eachValid}
        pending={pending}
        formOptions={formOptions}
      />
    </Modal>
  );
};
