import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$accountId} from '~/entities/wallet';
import {Col} from '~/shared/ui/components/col';
import {Typography} from '~/shared/ui/components/typography';

export const UserHasNotDao = () => {
  const {t} = useTranslation('dao');
  const accountId = useStore($accountId);

  return (
    <Col>
      <Typography>{t('daoInit.hasNotDAOTitle')}</Typography>
      <Typography as='span'>{t('daoInit.hasNotDAOSubTitle')}</Typography>
      <Typography as='span'>{accountId}</Typography>
    </Col>
  );
};
