import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {employeeModel} from '~/entities/employee';
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

// TODO WIP, i18n будет добавлен перед тем как ПР будет открыт
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Freelancer = ({fields, t, pending}: any) => (
  <>
    <Row gap='md' className='justify-between'>
      <Label
        required
        content='Name and Surname'
        error={fields.target.errorText()}
        className='basis-1/3'
      >
        <Input
          name='target'
          value={fields.target.value}
          disabled={pending}
          placeholder='Jon Daw'
          onChange={fields.target.onChange}
        />
      </Label>
      <Label required content='Near login' error={fields.amount.errorText()} className='basis-1/3'>
        <Input
          name='amount'
          value={fields.amount.value}
          disabled={pending}
          placeholder='login.near'
          onChange={fields.amount.onChange}
        />
      </Label>
      <Label required content='Role' error={fields.token.errorText()} className='basis-1/3'>
        <InputDropdown
          name='token'
          value={fields.token.value}
          disabled={pending}
          placeholder='SMM Designer'
          onChange={fields.token.onChange}
          options={[{label: 'NEAR', value: 'near'}]}
        />
      </Label>
    </Row>
    <Row gap='md' className='justify-between'>
      <Label required content='E-mail' error={fields.target.errorText()} className='basis-1/3'>
        <Input
          name='target'
          value={fields.target.value}
          disabled={pending}
          placeholder='mail@mail.com'
          onChange={fields.target.onChange}
        />
      </Label>
      <Label required content='Amount' error={fields.amount.errorText()} className='basis-1/3'>
        <Input
          name='amount'
          value={fields.amount.value}
          disabled={pending}
          placeholder='0.00'
          onChange={fields.amount.onChange}
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
      <Label content='Comment' error={fields.description.errorText()} className='w-full'>
        <Input
          name='description'
          value={fields.description.value}
          disabled={pending}
          placeholder='You can type something to highlight the main terms'
          onChange={fields.description.onChange}
        />
      </Label>
    </Row>
  </>
);

const formTypes: Record<string, React.ComponentType<any>> = {
  Freelancer,
  Contractor: EmptyFormType,
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
          <Button
            as={Link}
            // @ts-expect-error
            to={ROUTES.dao.path}
            variant='outlined'
          >
            Cancel
          </Button>
          <Button disabled={!eachValid || pending} type='submit' variant='soft'>
            Add
          </Button>
        </Row>
      </Col>
    </form>
  );
};
