import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$accountId, logoutClicked} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Portlet} from '~/shared/ui/components/portlet';
import {Typography} from '~/shared/ui/components/typography';

export const DaoInit = () => {
  const {t} = useTranslation('dao');
  const accountId = useStore($accountId);

  return (
    <Portlet gap='xl'>
      <Col>
        <Typography>{t('title')}</Typography>
        <Typography as='span'>{t('subTitle')}</Typography>
        <Typography as='span'>{accountId}</Typography>
      </Col>
      <Col>
        <Button variant='soft' onClick={() => logoutClicked()}>
          {t('logout')}
        </Button>
        {/* @ts-expect-error */}
        <Button as={Link} to={ROUTES.daoNew.path} variant='outlined'>
          {t('createDAO')}
        </Button>
      </Col>
    </Portlet>
  );
};
