import clsx from 'clsx';
import {useForm} from 'effector-forms';
import {useStore} from 'effector-react';
import React, {FormEventHandler} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {createDaoForm, createDaoFx} from '~/entities/dao';
import {sendTransactionsFx} from '~/entities/transactions';
import {$accountId} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {useQuery} from '~/shared/hooks/use-query';
import {Alert} from '~/shared/ui/components/alert';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {IconButton} from '~/shared/ui/components/icon-button';
import {Input} from '~/shared/ui/components/input';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as Plus} from '~/shared/ui/icons/plus.svg';

enum FormView {
  DAO_SETUP = 'daoSetup',
  ADD_COUNCILS = 'addCouncils',
}

export const DaoNew = () => {
  const {t} = useTranslation('dao');
  const councilAddressRef = React.useRef<HTMLInputElement>(null);
  const {fields, submit, eachValid} = useForm(createDaoForm);
  const pending = useStore(createDaoFx.pending);
  const [formView, setFormView] = React.useState(FormView.DAO_SETUP);
  const accountId = useStore($accountId);
  const query = useQuery();
  // safe query to local state and after clear it from url
  const [errorMessage] = React.useState(query.errorMessage);

  React.useEffect(() => {
    sendTransactionsFx();
  }, []);

  const handleAddTypedCouncil = () => {
    const updatedCouncilList = [...fields.councilList.value, fields.councilAddress.value];

    fields.councilList.onChange(updatedCouncilList);
    fields.councilAddress.onChange('');
    councilAddressRef.current?.focus();
  };
  const handleRemoveTypedCouncil = (council: string) => {
    const updatedCouncilList = fields.councilList.value.filter((c) => c !== council);

    fields.councilList.onChange(updatedCouncilList);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <Portlet gap='md' className='pb-12 mobile:pb-8'>
      {formView === FormView.DAO_SETUP && (
        <>
          <Col gap='xs'>
            <Typography font='heading'>{t('daoNew.setupTitle')}</Typography>
            <Typography as='span'>{t('daoNew.setupSubTitle')}</Typography>
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
                <Label
                  required
                  content={t('daoNew.addressLabel')}
                  error={fields.address.errorText()}
                >
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
              <Col>
                <Button
                  disabled={!eachValid || pending || !fields.name.value || !fields.address.value}
                  variant='outlined'
                  onClick={() => setFormView(FormView.ADD_COUNCILS)}
                >
                  {t('daoNew.submitDaoName')}
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
            </Col>
          </form>
          {errorMessage && (
            <Alert variant='danger' className='mt-4'>
              {errorMessage}
            </Alert>
          )}
        </>
      )}
      {formView === FormView.ADD_COUNCILS && (
        <>
          <Col gap='xs'>
            <Typography font='heading'>{t('daoNew.addCouncilsTitle')}</Typography>
            <Typography as='span' weight='medium'>
              {t('daoNew.addCouncilsSubTitle')}
            </Typography>
          </Col>
          <form onSubmit={handleSubmit}>
            <Col gap='xl'>
              <Col gap='sm'>
                <Typography as='span' weight='medium'>
                  {accountId}
                </Typography>
                {fields.councilList.value.map((council: string) => (
                  <Row key={council} align='center'>
                    <Typography
                      as='span'
                      weight='medium'
                      className={clsx({
                        'text-blue-textDefault': fields.councilAddress.value === council,
                      })}
                    >
                      {council}
                    </Typography>
                    <IconButton size='xxs' onClick={() => handleRemoveTypedCouncil(council)}>
                      <Plus className='scale-100 translate-x-0 translate-y-0 skew-x-0 skew-y-0 rotate-45' />
                    </IconButton>
                  </Row>
                ))}
              </Col>
              <Row gap='md' className='items-end'>
                <Label
                  as='span'
                  content={t('daoNew.councilAddressLabel')}
                  error={fields.councilAddress.errorText()}
                  className='w-full'
                >
                  <Row>
                    <Input
                      ref={councilAddressRef}
                      name='councilAddress'
                      value={fields.councilAddress.value}
                      disabled={pending}
                      placeholder={t('daoNew.councilAddressPlaceholder')}
                      className='w-full'
                      onChange={fields.councilAddress.onChange}
                    />
                    <IconButton
                      onClick={handleAddTypedCouncil}
                      disabled={!fields.councilAddress.value}
                    >
                      <Plus />
                    </IconButton>
                  </Row>
                </Label>
              </Row>
              <Col gap='md'>
                <Button
                  disabled={fields.councilList.value.length === 0}
                  type='submit'
                  variant='outlined'
                >
                  {t('daoNew.submitCouncils')}
                </Button>
                <Button type='submit' variant='soft' disabled={fields.councilList.value.length > 0}>
                  {t('daoNew.skipCouncils')}
                </Button>
              </Col>
            </Col>
          </form>
        </>
      )}
    </Portlet>
  );
};
