import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';

import {createDaoForm, createDaoFx} from '~/entities/dao';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Typography} from '~/shared/ui/components/typography';

// TODO: обрабатывать квери параметры ошибки ?errorCode=userRejected&errorMessage=User%2520rejected%2520transaction
// когда возвращаемся из NEAR
// TODO: обрабатывать успешный кейс создания DAO ?transactionHashes=E2ARyRfXqNCwUhhjBLWfbhMoGhtxiKRekMEEXJXjvwLj
export const DaoNew = () => {
  const {fields, submit, eachValid} = useForm(createDaoForm);
  const pending = useStore(createDaoFx.pending);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <Portlet gap='xl'>
      <Col>
        <Typography>New DAO setup</Typography>
        <Typography as='span'>Enter DAO name and address</Typography>
      </Col>
      <form onSubmit={handleSubmit}>
        <Col gap='xl'>
          <Col gap='md'>
            <Label
              required
              content='Name'
              error={fields.name.errorText({
                required: 'Name is required',
              })}
            >
              <Input
                name='daoName'
                value={fields.name.value}
                disabled={pending}
                placeholder='New DAO Name'
                onChange={(e) => fields.name.onChange(e.target.value)}
              />
            </Label>
            <Label
              required
              content='Address'
              error={fields.address.errorText({
                required: 'Address is required',
              })}
            >
              <Input
                name='daoAddress'
                size='md'
                value={fields.address.value}
                disabled={pending}
                placeholder='newdaoname.sputnikv2.testnet'
                onChange={(e) => fields.address.onChange(e.target.value)}
              />
            </Label>
          </Col>
          <Button disabled={!eachValid || pending} type='submit' variant='outlined'>
            Create DAO
          </Button>
        </Col>
      </form>
    </Portlet>
  );
};
