import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {useTranslation} from 'react-i18next';

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

// TODO WIP, i18n будет добавлен перед тем как ПР будет открыт
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Freelancer = ({fields, t, pending}: any) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content='Name and Surname'
        error={fields.name.errorText()}
        className='basis-1/3'
      >
        <Input
          name='name'
          value={fields.name.value}
          disabled={pending}
          placeholder='Jon Daw'
          onChange={fields.name.onChange}
        />
      </Label>
      <Label required content='Near login' error={fields.wallet.errorText()} className='basis-1/3'>
        <Input
          name='wallet'
          value={fields.wallet.value}
          disabled={pending}
          placeholder='login.near'
          onChange={fields.wallet.onChange}
        />
      </Label>
      <Label required content='Role' error={fields.role.errorText()} className='basis-1/3'>
        <Input
          name='role'
          value={fields.role.value}
          disabled={pending}
          placeholder='SMM Designer'
          onChange={fields.role.onChange}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label required content='E-mail' error={fields.email.errorText()} className='basis-1/3'>
        <Input
          name='email'
          value={fields.email.value}
          disabled={pending}
          placeholder='mail@mail.com'
          onChange={fields.email.onChange}
        />
      </Label>
      <Label required content='Amount' error={fields.salary.errorText()} className='basis-1/3'>
        <Input
          name='salary'
          value={fields.salary.value}
          disabled={pending}
          placeholder='0.00'
          onChange={fields.salary.onChange}
        />
      </Label>
      <Label required content='Token' error={fields.token.errorText()} className='basis-1/3'>
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder='NEAR'
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row>
      <Label content='Comment' error={fields.comment.errorText()} className='w-full'>
        <Input
          name='comment'
          value={fields.comment.value}
          disabled={pending}
          placeholder='You can type something to highlight the main terms'
          onChange={fields.comment.onChange}
        />
      </Label>
    </Row>
  </>
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Contractor = ({fields, t, pending}: any) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label required content='Near login' error={fields.wallet.errorText()} className='basis-1/3'>
        <Input
          name='wallet'
          value={fields.wallet.value}
          disabled={pending}
          placeholder='login.near'
          onChange={fields.wallet.onChange}
        />
      </Label>
      <Label required content='Amount' error={fields.salary.errorText()} className='basis-1/3'>
        <Input
          name='salary'
          value={fields.salary.value}
          disabled={pending}
          placeholder='0.00'
          onChange={fields.salary.onChange}
        />
      </Label>
      <Label required content='Token' error={fields.token.errorText()} className='basis-1/3'>
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder='NEAR'
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content='Name and Surname'
        error={fields.name.errorText()}
        className='basis-1/3'
      >
        <Input
          name='name'
          value={fields.name.value}
          disabled={pending}
          placeholder='Jon Daw'
          onChange={fields.name.onChange}
        />
      </Label>
      <Label required content='Role' error={fields.role.errorText()} className='basis-1/3'>
        <Input
          name='role'
          value={fields.role.value}
          disabled={pending}
          placeholder='SMM Designer'
          onChange={fields.role.onChange}
        />
      </Label>
      <Label required content='E-mail' error={fields.email.errorText()} className='basis-1/3'>
        <Input
          name='email'
          value={fields.email.value}
          disabled={pending}
          placeholder='mail@mail.com'
          onChange={fields.email.onChange}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content='Start date'
        error={fields.startDate.errorText()}
        className='basis-1/3'
      >
        {/* TODO: add datepicker (RB-99) */}
        <Input
          name='startDate'
          value={fields.startDate.value}
          disabled={pending}
          placeholder='31/12/2022 00:00'
          onChange={fields.startDate.onChange}
        />
      </Label>
      <Label
        required
        content='Invoice period'
        error={fields.period.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='period'
          value={fields.period.value}
          disabled={pending}
          placeholder='NEAR'
          onChange={fields.period.onChange}
          options={[{label: '2 per month', value: '2 per month'}]}
        />
      </Label>
      <Label
        required
        content='Payout type'
        error={fields.payoutType.errorText()}
        className='basis-1/3'
      >
        <InputDropdown
          name='payoutType'
          value={fields.payoutType.value}
          disabled={pending}
          placeholder='NEAR'
          onChange={fields.payoutType.onChange}
          options={[{label: 'Smooth', value: 'Smooth'}]}
        />
      </Label>
    </Row>
    <Row>
      <Label content='Comment' error={fields.comment.errorText()} className='w-full'>
        <Input
          name='comment'
          value={fields.comment.value}
          disabled={pending}
          placeholder='You can type something to highlight the main terms'
          onChange={fields.comment.onChange}
        />
      </Label>
    </Row>
  </>
);

const formTypes: Record<string, React.ComponentType<any>> = {
  Freelancer,
  Contractor,
};

export const AddEmployeeForm = () => {
  const {t} = useTranslation('proposal');
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
            content='Employee type'
            error={fields.type.errorText()}
            className='basis-1/3'
          >
            <InputDropdown
              name='type'
              value={fields.type.value}
              disabled={pending}
              placeholder='Freelancer'
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
          <Label required content='Proposer' error={fields.type.errorText()} className='basis-1/3'>
            <Typography>{accountId}</Typography>
          </Label>
        </Row>

        <FormPartComponent fields={fields} t={t} pending={pending} />

        <Row justify='end'>
          <Button variant='outlined'>Cancel</Button>
          <Button disabled={!eachValid || pending} type='submit' variant='soft'>
            Add
          </Button>
        </Row>
      </Col>
    </form>
  );
};
