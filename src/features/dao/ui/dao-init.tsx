import {useStore} from 'effector-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {$accountId, logoutClicked} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Heading} from '~/shared/ui/components/heading';
import {Portlet} from '~/shared/ui/components/portlet';
import {Text} from '~/shared/ui/components/text';

export const DaoInit = () => {
  const {t} = useTranslation('dao');
  const accountId = useStore($accountId);

  return (
    <Portlet gap='xl'>
      <Col>
        <Heading>{t('title')}</Heading>
        <Text>{t('subTitle')}</Text>
        <Text>{accountId}</Text>
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
