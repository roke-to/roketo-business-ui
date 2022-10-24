import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {CreateProposalForm} from '~/entities/proposal/ui/create-proposal-form/create-proposal-form';
import {
  $tokensNonZeroBalance,
  createTreasuryProposalForm,
  createTreasuryProposalFx,
} from '~/entities/treasury/model/treasury';
import {$accountId} from '~/entities/wallet';
import {Modal, ModalProps} from 'ui/components/modal';

export const CreateTreasuryProposalModal = (modalProps: ModalProps) => {
  const {t} = useTranslation('proposal');
  const accountId = useStore($accountId);
  const tokenOptions = useStore($tokensNonZeroBalance);
  const {fields, submit, eachValid, reset} = useForm(createTreasuryProposalForm);
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
        accountId={accountId}
        tokenOptions={tokenOptions}
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
