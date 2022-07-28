import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ChangePolicyProposalFormType, changePolicyProposalFx} from '~/entities/governance';
import {Modal, ModalProps} from '~/shared/ui/components/modal';
import {CreateProposalForm} from '~/widgets/proposal/ui/create-form-modal';

export interface CreateProposalChangePolicyFormProps extends ModalProps {
  initializedChangePolicyProposalForm: ChangePolicyProposalFormType;
}

export const CreateProposalChangePolicyForm = ({
  initializedChangePolicyProposalForm,
  ...modalProps
}: CreateProposalChangePolicyFormProps) => {
  const {t} = useTranslation('proposal');

  const {fields, submit, eachValid} = useForm(initializedChangePolicyProposalForm);

  const pending = useStore(changePolicyProposalFx.pending);

  const formOptions = React.useMemo(
    () => [
      {
        value: 'changePolicy',
        label: t(`createForm.changePolicy`),
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
