import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {changePolicyProposalForm, changePolicyProposalFx} from '~/entities/governance';
import {Modal, ModalProps} from '~/shared/ui/components/modal';
import {CreateProposalForm} from '~/widgets/proposal/ui/create-form-modal';

export const CreateProposalChangePolicyForm = (modalProps: ModalProps) => {
  const {t} = useTranslation('proposal');

  const formOptions = React.useMemo(
    () => [
      {
        value: 'changePolicy',
        label: t(`createForm.changePolicy`),
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
