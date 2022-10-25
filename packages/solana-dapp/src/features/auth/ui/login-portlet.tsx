import React from 'react';
import {useTranslation} from 'react-i18next';

import {Col} from '@roketo/core/ui/components/col';
import {Portlet} from '@roketo/core/ui/components/portlet';
import {Typography} from '@roketo/core/ui/components/typography';

export const LoginPortlet = () => {
  const {t} = useTranslation('auth');

  return (
    <Portlet gap='xl' className='pb-12 mobile:pb-8'>
      <Col gap='sm'>
        <Typography font='heading' className='text-center'>
          {t('title')}
        </Typography>
        <Typography as='span'>{t('subTitle')}</Typography>
      </Col>
      <Col>
        <Typography as='p' color='muted' className='text-center'>
          {t('footer')}
        </Typography>
      </Col>
    </Portlet>
  );
};
