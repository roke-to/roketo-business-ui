import {AnyFormValues, ConnectedFields} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {TFunction} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$accountId} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import {AddCouncil} from './add-council';
import {ChangeQuorum} from './change-quorum';
import styles from './create-proposal-form.module.css';
import {RemoveCouncil} from './remove-council';
import {Transfer} from './transfer';

const EmptyFormType = () => <Typography>Coming soon...</Typography>;

const Nothing = () => null;

const formTypes: Record<string, React.ComponentType<any>> = {
  transfer: Transfer,
  transferNftMintbase: EmptyFormType,
  transferNftParas: EmptyFormType,
  functionalCall: EmptyFormType,
  createStream: EmptyFormType,
  changeQuorum: ChangeQuorum,
  addCouncil: AddCouncil,
  removeCouncil: RemoveCouncil,
};

export interface CreateProposalFormProps<T extends AnyFormValues> {
  fields: ConnectedFields<T>;
  submit(p: void): void;
  eachValid: boolean;
  pending: boolean;
  t: TFunction<'proposal'>;
  formOptions: {value: string; label: string}[];
}

export function CreateProposalForm<T extends AnyFormValues>({
  fields,
  submit,
  eachValid,
  pending,
  t,
  formOptions,
}: CreateProposalFormProps<T>) {
  const accountId = useStore($accountId);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submit();
  };

  const FormPartComponent = formTypes[fields.type.value] || Nothing;

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
            <Typography>{accountId}</Typography>
          </Label>
        </Row>

        <FormPartComponent fields={fields} t={t} pending={pending} />

        <Row justify='between' className='mobile:flex-col'>
          <Col gap='xs'>
            <Typography>{t('createForm.charge')}</Typography>
            <Row justify='between' className='mobile:flex-col'>
              {fields.amount.value && (
                <Typography>
                  {fields.amount.value} {fields.token.value}
                </Typography>
              )}
              {fields.tgas.value && <Typography>{fields.tgas.value} TGas</Typography>}
            </Row>
          </Col>
          <Row className='mobile:basis-auto'>
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
}
