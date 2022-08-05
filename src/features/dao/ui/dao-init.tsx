import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$daoIds, setDaoId} from '~/entities/dao';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Portlet} from '~/shared/ui/components/portlet';
import {RadioSelect} from '~/shared/ui/components/radio-select';
import {Typography} from '~/shared/ui/components/typography';

export const DaoInit = () => {
  const {t} = useTranslation('dao');
  const daoIds = useStore($daoIds);
  const accountId = useStore($accountId);
  const [selectedDao, setSelectedDao] = React.useState('');

  const handleSelectDao = React.useCallback(() => {
    setDaoId(selectedDao);
  }, [selectedDao]);

  const hadDao = daoIds.length > 0;

  const daoOptions = daoIds.map((value) => ({label: value, value}));

  return (
    <Portlet gap='md' className='pb-12 mobile:pb-8'>
      {hadDao ? (
        <Col gap='lg'>
          <Col gap='xs'>
            <Typography font='heading'>{t('daoInit.hasDAOTitle')}</Typography>
            <Typography as='span'>{t('daoInit.hasDAOSubTitle')}</Typography>
          </Col>
          <Col gap='xl'>
            <RadioSelect
              options={daoOptions}
              value={selectedDao}
              onChange={setSelectedDao}
              showAllText={t('daoInit.showAll')}
            />
            <Button onClick={handleSelectDao} disabled={!selectedDao} variant='soft'>
              {t('daoInit.selectDao')}
            </Button>
          </Col>
        </Col>
      ) : (
        <Col>
          <Typography>{t('daoInit.hasNotDAOTitle')}</Typography>
          <Typography as='span'>{t('daoInit.hasNotDAOSubTitle')}</Typography>
          <Typography as='span'>{accountId}</Typography>
        </Col>
      )}
      <Col>
        {/* @ts-expect-error */}
        <Button as={Link} to={ROUTES.daoNew.path} variant='outlined'>
          {t('daoInit.createDao')}
        </Button>
        <Button variant='outlined' onClick={() => logoutClicked()}>
          {t('daoInit.logout')} ({accountId})
        </Button>
      </Col>
    </Portlet>
  );
};
