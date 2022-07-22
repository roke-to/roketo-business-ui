import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {createProposalForm, createProposalFx} from '~/entities/treasury';
import {$accountId} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

const EmptyFormType = () => <Typography>Coming soon...</Typography>;

const Nothing = () => null;

const formTypes: Record<string, React.ComponentType> = {
  transfer: EmptyFormType,
  transferNftMintbase: EmptyFormType,
  transferNftParas: EmptyFormType,
  functionalCall: EmptyFormType,
  createStream: EmptyFormType,
};

export const CreateProposalForm = () => {
  const {t} = useTranslation('proposal');
  const accountId = useStore($accountId);
  const {fields, submit, eachValid} = useForm(createProposalForm);
  const pending = useStore(createProposalFx.pending);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submit();
  };

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
      {
        value: 'createStream',
        label: t(`createForm.createStream`),
      },
    ],
    [t],
  );

  const FormPartComponent = formTypes[fields.type.value] || Nothing;

  return (
    <form onSubmit={handleSubmit}>
      <Col gap='xl'>
        <Row gap='md' className='justify-between'>
          <Label
            required
            content={t('createForm.proposalTypeLabel')}
            error={fields.type.errorText()}
            className='basis-1/3'
          >
            <InputDropdown
              name='type'
              value={fields.type.value}
              disabled={pending}
              placeholder={t('createForm.proposalTypeLabel')}
              onChange={(value) => fields.type.onChange(value)}
              options={formOptions}
            />
          </Label>
          <Label
            required
            content={t('createForm.proposalTypeLabel')}
            error={fields.type.errorText()}
            className='basis-1/3'
          >
            <Typography>{accountId}</Typography>
          </Label>
        </Row>

        <FormPartComponent />

        <Row>
          <Button disabled={!eachValid || pending} type='submit' variant='outlined'>
            {t('createForm.submit')}
          </Button>
          <Button
            as={Link}
            // @ts-expect-error
            to={ROUTES.dao.path}
            variant='soft'
          >
            {t('createForm.cancel')}
          </Button>
        </Row>
      </Col>
    </form>
  );
};
