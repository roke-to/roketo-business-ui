import {Form} from 'effector-forms';
import React, {FormEventHandler} from 'react';

import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Input} from '~/shared/ui/components/input';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {ShowMore} from '~/shared/ui/components/show-more';
import {Typography} from '~/shared/ui/components/typography';

import styles from './create-proposal-form.module.css';
import {AddCouncil} from './type/add-council';
import {IFormBaseProps, IFormPartProps} from './type/base';
import {ChangeQuorum} from './type/change-quorum';
import {FunctionCall} from './type/function-call';
import {RemoveCouncil} from './type/remove-council';
import {Transfer} from './type/transfer';

const EmptyFormType = () => <Typography>Coming soon...</Typography>;

const Nothing = () => null;

const formTypes: Record<string, React.ComponentType<IFormPartProps>> = {
  transfer: Transfer,
  transferNftMintbase: EmptyFormType,
  transferNftParas: EmptyFormType,
  functionCall: FunctionCall,
  createStream: EmptyFormType,
  changeQuorum: ChangeQuorum,
  addCouncil: AddCouncil,
  removeCouncil: RemoveCouncil,
};

type FormTypeKey = keyof typeof formTypes;

type CommonFormValues = {
  type: FormTypeKey;
  link: string;
  tgas: string;
  amount: string;
  token: string;
};

export interface CreateProposalFormProps<F extends Form<CommonFormValues>>
  extends IFormBaseProps<F> {
  accountId: string;
  submit(p: void): void;
  reset(p: void): void;
  eachValid: boolean;
  formOptions: Array<{value: string; label: string}>;
  tokenOptions: Array<{value: string; label: string}>;
  onReset?: (p: void) => void;
}

export function CreateProposalForm<F extends Form<CommonFormValues>>({
  accountId,
  tokenOptions,
  fields,
  submit,
  reset,
  eachValid,
  pending,
  t,
  onReset,
  formOptions,
}: CreateProposalFormProps<F>) {
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submit();
  };

  const FormPartComponent = formTypes[fields.type.value] || Nothing;

  const handleClickCancel = () => {
    reset();
    onReset?.();
  };

  const tokenLabel = tokenOptions.find(
    (tknOption) => tknOption.value === fields.token.value,
  )?.label;

  return (
    <form onSubmit={handleSubmit}>
      <Col gap='xl'>
        <Row gap='md' className='justify-between'>
          <Label
            required
            content={t('createForm.proposalTypeLabel')}
            error={fields.type.errorText()}
            className={styles.proposalTypeLabel}
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
            content={t('createForm.proposerLabel')}
            error={fields.type.errorText()}
            className={styles.proposerLabel}
          >
            <Typography as='span' className='truncate'>
              {accountId}
            </Typography>
          </Label>
        </Row>

        {/* @ts-expect-error */}
        <FormPartComponent fields={fields} t={t} pending={pending} tokenOptions={tokenOptions} />

        <ShowMore showMoreText={t('showMore')} showLessText={t('showLess')}>
          <Row className='mobile:flex-col'>
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
        </ShowMore>

        <Row justify='between' className='mobile:flex-col'>
          <Col gap='xs'>
            <Typography>{t('createForm.charge')}</Typography>
            <Row justify='between' className='mobile:flex-col'>
              {fields.amount.value && (
                <Typography>
                  {fields.amount.value} {tokenLabel}
                </Typography>
              )}
              {fields.tgas.value && <Typography>{fields.tgas.value} TGas</Typography>}
            </Row>
          </Col>
          <Row className='mobile:basis-auto'>
            <Button onClick={handleClickCancel} variant='outlined'>
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
}
