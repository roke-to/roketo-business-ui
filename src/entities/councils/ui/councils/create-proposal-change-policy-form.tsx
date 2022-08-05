import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {changePolicyProposalForm, changePolicyProposalFx} from '~/entities/governance';
import {CreateProposalForm} from '~/entities/proposal/ui/create-form-modal';
import {Modal, ModalProps} from '~/shared/ui/components/modal';

export const CreateProposalChangePolicyForm = (modalProps: ModalProps) => {
  const {t} = useTranslation('proposal');

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

  const {fields, submit, eachValid} = useForm(changePolicyProposalForm);
  const pending = useStore(changePolicyProposalFx.pending);

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
