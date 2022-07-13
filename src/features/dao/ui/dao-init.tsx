import {useStore} from 'effector-react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$userDAOids, loadDAOsList} from '~/entities/dao';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Portlet} from '~/shared/ui/components/portlet';
import {Typography} from '~/shared/ui/components/typography';

export const DaoInit = () => {
  const {t} = useTranslation('dao');
  const accountId = useStore($accountId);
  const userDAOs = useStore($userDAOids);

  useEffect(() => {
    loadDAOsList();
  }, []);

  return (
    <Portlet gap='xl'>
      <Col>
        <pre>{JSON.stringify({userDAOs}, null, 2)}</pre>
      </Col>
      <Col>
        <Typography>{t('daoInit.title')}</Typography>
        <Typography as='span'>{t('daoInit.subTitle')}</Typography>
        <Typography as='span'>{accountId}</Typography>
      </Col>
      <Col>
        <Button variant='outlined' onClick={() => loadDAOsList()}>
          TEST
        </Button>
        <Button variant='soft' onClick={() => logoutClicked()}>
          {t('daoInit.logout')}
        </Button>
        {/* @ts-expect-error */}
        <Button as={Link} to={ROUTES.daoNew.path} variant='outlined'>
          {t('daoInit.createDaoLink')}
        </Button>
      </Col>
    </Portlet>
  );
};
