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
import {Input} from '~/shared/ui/components/input';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

const EmptyFormType = () => <Typography>Coming soon...</Typography>;

const Nothing = () => null;

const Transfer = ({fields, t, pending}: any) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('createForm.targetLabel')}
        error={fields.target.errorText()}
        className='basis-1/3'
      >
        <Input
          name='target'
          value={fields.target.value}
          disabled={pending}
          placeholder={t('createForm.targetPlaceholder')}
          onChange={fields.target.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.amountLabel')}
        error={fields.amount.errorText()}
        className='basis-1/3'
      >
        <Input
          name='amount'
          value={fields.amount.value}
          disabled={pending}
          placeholder={t('createForm.amountPlaceholder')}
          onChange={fields.amount.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.tokenLabel')}
        error={fields.token.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder={t('createForm.tokenPlaceholder')}
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('createForm.descriptionLabel')}
        error={fields.description.errorText()}
        className='w-full'
      >
        <Input
          name='description'
          value={fields.description.value}
          disabled={pending}
          placeholder={t('createForm.descriptionPlaceholder')}
          onChange={fields.description.onChange}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('createForm.linkLabel')}
        error={fields.link.errorText()}
        className='basis-1/3'
      >
        <Input
          name='link'
          value={fields.link.value}
          disabled={pending}
          placeholder={t('createForm.linkPlaceholder')}
          onChange={fields.link.onChange}
        />
      </Label>
      <Label
        required
        content={t('createForm.tgasLabel')}
        error={fields.tgas.errorText()}
        className='basis-1/3'
      >
        <Input
          name='tgas'
          value={fields.tgas.value}
          disabled={pending}
          placeholder={t('createForm.tgasPlaceholder')}
          onChange={fields.tgas.onChange}
        />
      </Label>
    </Row>
  </>
);

const formTypes: Record<string, React.ComponentType<any>> = {
  transfer: Transfer,
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
              onChange={fields.type.onChange}
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

        <FormPartComponent fields={fields} t={t} pending={pending} />

        <Row justify='between'>
          <Col gap='xs'>
            <Typography>{t('createForm.charge')}</Typography>
            <Row justify='between'>
              {fields.amount.value && (
                <Typography>
                  {fields.amount.value} {fields.token.value}
                </Typography>
              )}
              {fields.tgas.value && <Typography>{fields.tgas.value} TGas</Typography>}
            </Row>
          </Col>
          <Row>
            <Button
              as={Link}
              // @ts-expect-error
              to={ROUTES.dao.path}
              variant='outlined'
            >
              {t('createForm.cancel')}
            </Button>
            <Button disabled={!eachValid || pending} type='submit' variant='soft'>
              {t('createForm.submit')}
            </Button>
          </Row>
        </Row>
      </Col>
    </form>
  );
};
