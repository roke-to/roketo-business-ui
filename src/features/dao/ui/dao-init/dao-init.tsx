import {useStore} from 'effector-react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$userDAOids, loadDAOsList} from '~/entities/dao';
import {logoutClicked} from '~/entities/wallet';
import {UserHasDao} from '~/features/dao/ui/dao-init/user-has-dao';
import {UserHasNotDao} from '~/features/dao/ui/dao-init/user-has-not-dao';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Portlet} from '~/shared/ui/components/portlet';

export const DaoInit = () => {
  const {t} = useTranslation('dao');
  const userDAOs = useStore($userDAOids);

  useEffect(() => {
    loadDAOsList();
  }, []);

  return (
    <Portlet gap='xl'>
      {userDAOs.length ? <UserHasDao userDAOs={userDAOs} /> : <UserHasNotDao />}
      <Col>
        {/* @ts-expect-error */}
        <Button as={Link} to={ROUTES.daoNew.path} variant='outlined'>
          {t('daoInit.createDAO')}
        </Button>
        <Button variant='soft' onClick={() => logoutClicked()}>
          {t('daoInit.logout')}
        </Button>
      </Col>
    </Portlet>
  );
};
