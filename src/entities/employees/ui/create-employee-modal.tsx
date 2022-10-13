import {ConnectedFields, useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {TFunction, useTranslation} from 'react-i18next';

import {employeeModel} from '~/entities/employee';
import {$accountId} from '~/entities/wallet';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Datepicker} from '~/shared/ui/components/datepicker';
import {Input} from '~/shared/ui/components/input';
import {InputDropdown} from '~/shared/ui/components/input-dropdown';
import {Label} from '~/shared/ui/components/label';
import {Modal, ModalProps} from '~/shared/ui/components/modal';
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
        content={t('createEmployee.form.labels.name.label')}
        error={fields.name.errorText()}
        className='basis-1/3'
      >
        <Input
          name='name'
          value={fields.name.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.name.placeholder')}
          onChange={fields.name.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.nearLogin.label')}
        error={fields.nearLogin.errorText()}
        className='basis-1/3'
      >
        <Input
          name='nearLogin'
          value={fields.nearLogin.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.nearLogin.placeholder')}
          onChange={fields.nearLogin.onChange}
        />
      </Label>
      <Label content={t('createEmployee.form.labels.role.label')} className='basis-1/3'>
        <Input
          name='role'
          value={fields.position?.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.role.placeholder')}
          onChange={fields.position?.onChange}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('createEmployee.form.labels.email.label')}
        error={fields.email.errorText()}
        className='basis-1/3'
      >
        <Input
          name='email'
          value={fields.email.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.email.placeholder')}
          onChange={fields.email.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.salary.label')}
        error={fields.amount.errorText()}
        className='basis-1/3'
      >
        <Input
          name='salary'
          value={fields.amount.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.salary.placeholder')}
          onChange={fields.amount.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.token.label')}
        error={fields.token.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.token.placeholder')}
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('createEmployee.form.labels.comment.label')}
        error={fields.comment?.errorText()}
        className='w-full'
      >
        <Input
          name='comment'
          value={fields.comment?.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.comment.placeholder')}
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
        content={t('createEmployee.form.labels.nearLogin.label')}
        error={fields.nearLogin.errorText()}
        className='basis-1/3'
      >
        <Input
          name='nearLogin'
          value={fields.nearLogin.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.nearLogin.placeholder')}
          onChange={fields.nearLogin.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.salary.label')}
        error={fields.amount.errorText()}
        className='basis-1/3'
      >
        <Input
          name='salary'
          value={fields.amount.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.salary.placeholder')}
          onChange={fields.amount.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.token.label')}
        error={fields.token.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.token.placeholder')}
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content={t('createEmployee.form.labels.name.label')}
        error={fields.name.errorText()}
        className='basis-1/3'
      >
        <Input
          name='name'
          value={fields.name.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.name.placeholder')}
          onChange={fields.name.onChange}
        />
      </Label>
      <Label content={t('createEmployee.form.labels.role.label')} className='basis-1/3'>
        <Input
          name='role'
          value={fields.position?.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.role.placeholder')}
          onChange={fields.position?.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.email.label')}
        error={fields.email.errorText()}
        className='basis-1/3'
      >
        <Input
          name='email'
          value={fields.email.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.email.placeholder')}
          onChange={fields.email.onChange}
        />
      </Label>
    </Row>
    <Row gap='md'>
      <Label
        required
        content={t('createEmployee.form.labels.startDate.label')}
        error={fields.startDate?.errorText()}
        className='basis-1/3'
      >
        <Datepicker
          name='startDate'
          value={fields.startDate?.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.startDate.placeholder')}
          // TODO add support for optional field
          // @ts-expect-error
          onChange={fields.startDate?.onChange}
        />
      </Label>
      <Label
        required
        content={t('createEmployee.form.labels.period.label')}
        error={fields.payPeriod.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='period'
          value={fields.payPeriod.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.period.placeholder')}
          onChange={fields.payPeriod.onChange}
          options={[
            {label: '1 per month', value: '1'},
            {label: '2 per month', value: '2'},
          ]}
        />
      </Label>
    </Row>
    <Row>
      <Label
        content={t('createEmployee.form.labels.comment.label')}
        error={fields.comment?.errorText()}
        className='w-full'
      >
        <Input
          name='comment'
          value={fields.comment?.value}
          disabled={pending}
          placeholder={t('createEmployee.form.labels.comment.placeholder')}
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

export const CreateEmployeeModal = (modalProps: ModalProps) => {
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
    <Modal {...modalProps}>
      <form onSubmit={handleSubmit}>
        <Col gap='xl'>
          <Row gap='md' className='justify-between'>
            <Label
              required
              content={t('createEmployee.form.labels.type.label')}
              error={fields.type.errorText()}
              className='basis-1/3'
            >
              <InputDropdown
                name='type'
                value={fields.type.value}
                disabled={pending}
                placeholder={t('createEmployee.form.labels.type.placeholder')}
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
              content={t('createEmployee.form.proposer')}
              error={fields.type.errorText()}
              className='basis-1/3 min-w-0'
            >
              <Typography as='span' className='truncate'>
                {accountId}
              </Typography>
            </Label>
          </Row>

          <FormPartComponent fields={fields} t={t} pending={pending} />

          <Row justify='end'>
            <Button
              type='reset'
              variant='outlined'
              // TODO TBD это правило вообще нужно?
              // eslint-disable-next-line react/destructuring-assignment
              onClick={modalProps.onCloseModal}
            >
              {t('createEmployee.form.abort')}
            </Button>
            <Button type='submit' variant='soft' disabled={!eachValid || pending}>
              {t('createEmployee.form.submit')}
            </Button>
          </Row>
        </Col>
      </form>
    </Modal>
  );
};
