import {ConnectedFields, useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {TFunction, useTranslation} from 'react-i18next';

import {employeeModel} from '~/entities/employee';
import {$accountId} from '~/entities/wallet';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Input} from '~/shared/ui/components/input';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

const Nothing = () => null;

interface FormTypesProps {
  fields: ConnectedFields<employeeModel.AddEmployeeFormFields>;
  t: TFunction<'employees'>;
  pending: boolean;
}

const Freelancer = ({fields, t, pending}: FormTypesProps) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('addEmployee.form.labels.name.label')}
        error={fields.name.errorText()}
        className='basis-1/3'
      >
        <Input
          name='name'
          value={fields.name.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.name.placeholder')}
          onChange={fields.name.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.wallet.label')}
        error={fields.wallet.errorText()}
        className='basis-1/3'
      >
        <Input
          name='wallet'
          value={fields.wallet.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.wallet.placeholder')}
          onChange={fields.wallet.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.role.label')}
        error={fields.role.errorText()}
        className='basis-1/3'
      >
        <Input
          name='role'
          value={fields.role.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.role.placeholder')}
          onChange={fields.role.onChange}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('addEmployee.form.labels.email.label')}
        error={fields.email.errorText()}
        className='basis-1/3'
      >
        <Input
          name='email'
          value={fields.email.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.email.placeholder')}
          onChange={fields.email.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.salary.label')}
        error={fields.salary.errorText()}
        className='basis-1/3'
      >
        <Input
          name='salary'
          value={fields.salary.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.salary.placeholder')}
          onChange={fields.salary.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.token.label')}
        error={fields.token.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.token.placeholder')}
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('addEmployee.form.labels.comment.label')}
        error={fields.comment?.errorText()}
        className='w-full'
      >
        <Input
          name='comment'
          value={fields.comment?.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.comment.placeholder')}
          onChange={fields.comment?.onChange}
        />
      </Label>
    </Row>
  </>
);
const Contractor = ({fields, t, pending}: FormTypesProps) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('addEmployee.form.labels.wallet.label')}
        error={fields.wallet.errorText()}
        className='basis-1/3'
      >
        <Input
          name='wallet'
          value={fields.wallet.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.wallet.placeholder')}
          onChange={fields.wallet.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.salary.label')}
        error={fields.salary.errorText()}
        className='basis-1/3'
      >
        <Input
          name='salary'
          value={fields.salary.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.salary.placeholder')}
          onChange={fields.salary.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.token.label')}
        error={fields.token.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.token.placeholder')}
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('addEmployee.form.labels.name.label')}
        error={fields.name.errorText()}
        className='basis-1/3'
      >
        <Input
          name='name'
          value={fields.name.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.name.placeholder')}
          onChange={fields.name.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.role.label')}
        error={fields.role.errorText()}
        className='basis-1/3'
      >
        <Input
          name='role'
          value={fields.role.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.role.placeholder')}
          onChange={fields.role.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.email.label')}
        error={fields.email.errorText()}
        className='basis-1/3'
      >
        <Input
          name='email'
          value={fields.email.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.email.placeholder')}
          onChange={fields.email.onChange}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('addEmployee.form.labels.startDate.label')}
        error={fields.startDate.errorText()}
        className='basis-1/3'
      >
        {/* TODO: add datepicker (RB-99) */}
        <Input
          name='startDate'
          value={fields.startDate.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.startDate.placeholder')}
          onChange={fields.startDate.onChange}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.period.label')}
        error={fields.period.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='period'
          value={fields.period.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.period.placeholder')}
          onChange={fields.period.onChange}
          options={[{label: '2 per month', value: '2 per month'}]}
        />
      </Label>
      <Label
        required
        content={t('addEmployee.form.labels.payoutType.label')}
        error={fields.payoutType.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='payoutType'
          value={fields.payoutType.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.payoutType.placeholder')}
          onChange={fields.payoutType.onChange}
          options={[{label: 'Smooth', value: 'Smooth'}]}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('addEmployee.form.labels.comment.label')}
        error={fields.comment?.errorText()}
        className='w-full'
      >
        <Input
          name='comment'
          value={fields.comment?.value}
          disabled={pending}
          placeholder={t('addEmployee.form.labels.comment.placeholder')}
          onChange={fields.comment?.onChange}
        />
      </Label>
    </Row>
  </>
);

const formTypes = {
  Freelancer,
  Contractor,
};

export const AddEmployeeForm = () => {
  const {t} = useTranslation('employees');
  const accountId = useStore($accountId);
  const {fields, submit, eachValid} = useForm(employeeModel.addEmployeeForm);
  const pending = useStore(employeeModel.addEmployeeFx.pending);

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
            content={t('addEmployee.form.labels.type.label')}
            error={fields.type.errorText()}
            className='basis-1/3'
          >
            <InputDropdown
              name='type'
              value={fields.type.value}
              disabled={pending}
              placeholder={t('addEmployee.form.labels.type.placeholder')}
              onChange={fields.type.onChange}
              options={[
                {
                  value: 'Freelancer',
                  label: 'Freelancer',
                },
                {
                  value: 'Contractor',
                  label: 'Contractor',
                },
              ]}
            />
          </Label>
          <Label
            required
            content={t('addEmployee.form.proposer')}
            error={fields.type.errorText()}
            className='basis-1/3'
          >
            <Typography>{accountId}</Typography>
          </Label>
        </Row>

        <FormPartComponent fields={fields} t={t} pending={pending} />

        <Row justify='end'>
          <Button variant='outlined'>{t('addEmployee.form.abort')}</Button>
          <Button disabled={!eachValid || pending} type='submit' variant='soft'>
            {t('addEmployee.form.submit')}
          </Button>
        </Row>
      </Col>
    </form>
  );
};