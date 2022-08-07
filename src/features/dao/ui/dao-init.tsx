import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

import {$daoIds, $daosLoading, setDaoId} from '~/entities/dao';
import {$accountId, logoutClicked} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Portlet} from '~/shared/ui/components/portlet';
import {RadioSelect} from '~/shared/ui/components/radio-select';
import {Typography} from '~/shared/ui/components/typography';

enum View {
  EMPTY = 'empty',
  LIST = 'list',
}

export const DaoInit = () => {
  const {t} = useTranslation('dao');
  const daoIds = useStore($daoIds);
  const accountId = useStore($accountId);
  const daosLoading = useStore($daosLoading);
  const [selectedDao, setSelectedDao] = React.useState('');

  const handleSelectDao = React.useCallback(() => {
    setDaoId(selectedDao);
  }, [selectedDao]);

  const hasDao = daoIds.length > 0;

  const daoOptions = daoIds.map((value) => ({label: value, value}));

  // view state mashine
  const view = hasDao ? View.LIST : View.EMPTY;

  if (daosLoading) {
    return null;
  }

  return (
    <Portlet gap='md' className='pb-12 mobile:pb-8'>
      {view === View.LIST && (
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
      )}
      {view === View.EMPTY && (
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
