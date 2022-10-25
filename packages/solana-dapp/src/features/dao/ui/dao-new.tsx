import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$accountId} from '~/entities/wallet';

import {useQuery} from '@roketo/core/hooks/use-query';
import {Alert} from '@roketo/core/ui/components/alert';
import {Button} from '@roketo/core/ui/components/button';
import {Col} from '@roketo/core/ui/components/col';
import {Typography} from '@roketo/core/ui/components/typography';

enum FormView {
  DAO_SETUP = 'daoSetup',
  ADD_COUNCILS = 'addCouncils',
}

interface DaoNewProps {
  onReset?: () => void;
}

export const DaoNew = ({onReset}: DaoNewProps) => {
  const {t} = useTranslation('dao');
  const [formView, setFormView] = React.useState(FormView.DAO_SETUP);
  const accountId = useStore($accountId);
  const query = useQuery();
  // safe query to local state and after clear it from url
  const [errorMessage] = React.useState(query.errorMessage);

  // Don't showing the form, if it possible
  // to redirect to newly created DAO (redirectAfterCreateDaoFx)
  if (query.newDaoAddress) {
    return null;
  }

  return (
    <>
      {formView === FormView.DAO_SETUP && (
        <>
          <Col gap='xs'>
            <Typography font='heading'>{t('daoNew.setupTitle')}</Typography>
            <Typography as='span'>{t('daoNew.setupSubTitle')}</Typography>
          </Col>
          {accountId}
          FormView.DAO_SETUP
          <Col>
            <Button variant='outlined' onClick={() => setFormView(FormView.ADD_COUNCILS)}>
              {t('daoNew.submitDaoName')}
            </Button>
            <Button variant='soft' onClick={onReset}>
              {t('daoNew.cancel')}
            </Button>
          </Col>
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
          {accountId}
          FormView.ADD_COUNCILS
        </>
      )}
    </>
  );
};
