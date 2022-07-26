import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {createDaoForm, createDaoFx} from '~/entities/dao';
import {ROUTES} from '~/shared/config/routes';
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
  const {t} = useTranslation('dao');
  const {fields, submit, eachValid} = useForm(createDaoForm);
  const pending = useStore(createDaoFx.pending);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <Portlet gap='xl'>
      <Col>
        <Typography>{t('daoNew.title')}</Typography>
        <Typography as='span'>{t('daoNew.subTitle')}</Typography>
      </Col>
      <form onSubmit={handleSubmit}>
        <Col gap='xl'>
          <Col gap='md'>
            <Label required content={t('daoNew.nameLabel')} error={fields.name.errorText()}>
              <Input
                name='daoName'
                value={fields.name.value}
                disabled={pending}
                placeholder={t('daoNew.namePlaceholder')}
                onChange={fields.name.onChange}
              />
            </Label>
            <Label required content={t('daoNew.addressLabel')} error={fields.address.errorText()}>
              <Input
                name='daoAddress'
                size='md'
                value={fields.address.value}
                disabled={pending}
                placeholder={t('daoNew.addressPlaceholder')}
                onChange={fields.address.onChange}
              />
            </Label>
          </Col>
          <Button disabled={!eachValid || pending} type='submit' variant='outlined'>
            {t('daoNew.submit')}
          </Button>
          <Button
            as={Link}
            // @ts-expect-error
            to={ROUTES.dao.path}
            variant='soft'
          >
            {t('daoNew.back')}
          </Button>
        </Col>
      </form>
    </Portlet>
  );
};
