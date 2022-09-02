import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateProposalForm} from '~/entities/proposal/ui/create-proposal-form/create-proposal-form';
import {
  createTreasuryProposalForm,
  createTreasuryProposalFx,
} from '~/entities/treasury/model/treasury';
import {Modal, ModalProps} from '~/shared/ui/components/modal';

export const CreateTreasuryProposalModal = (modalProps: ModalProps) => {
  const {t} = useTranslation('proposal');
  const {fields, submit, eachValid} = useForm(createTreasuryProposalForm);
  const pending = useStore(createTreasuryProposalFx.pending);

  const formOptions = React.useMemo(
    () => [
      {
        value: 'transfer',
        label: t(`createForm.transfer`),
      },
      // TODO: uncomment when NFT will implemented
      // {
      //   value: 'transferNftMintbase',
      //   label: t(`createForm.transferNftMintbase`),
      // },
      // {
      //   value: 'transferNftParas',
      //   label: t(`createForm.transferNftParas`),
      // },
      {
        value: 'functionCall',
        label: t(`createForm.functionCall`),
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
