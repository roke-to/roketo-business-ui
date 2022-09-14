import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {$daoIds, $daosLoading} from '~/entities/dao';
import {$accountId, logoutClicked, setCurrentDaoId} from '~/entities/wallet';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {ButtonLink} from '~/shared/ui/components/button-link';
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
  const history = useHistory();

  const handleSelectDao = React.useCallback(
    () => {
      setCurrentDaoId(selectedDao);
      history.replace(ROUTES.treasury.path);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- history always same
    [selectedDao],
  );

  const hasDao = daoIds.length > 0;

  const daoOptions = daoIds.map((value) => ({label: value, value}));

  // view state mashine
  const view = hasDao ? View.LIST : View.EMPTY;

  const [hasDaoTitleLeft, hasDaoTitleRight] = t('daoInit.hasDaoSubtitle').split('$accountId');

  if (daosLoading) {
    return null;
  }

  return (
    <Portlet gap='md' className='pb-12 mobile:pb-8'>
      {view === View.LIST && (
        <Col gap='lg'>
          <Col gap='xs'>
            <Typography font='heading'>{t('daoInit.hasDaoTitle')}</Typography>
            <Typography as='span'>
              {hasDaoTitleLeft}
              <Typography as='span' data-qa='account' className='break-words'>
                {accountId}
              </Typography>
              {hasDaoTitleRight}
            </Typography>
          </Col>
          <Col gap='xl'>
            <RadioSelect
              options={daoOptions}
              value={selectedDao}
              onChange={setSelectedDao}
              showAllText={t('daoInit.showAll')}
              showLessText={t('daoInit.showLess')}
            />
            <Button onClick={handleSelectDao} disabled={!selectedDao} variant='soft'>
              {t('daoInit.selectDao')}
            </Button>
          </Col>
        </Col>
      )}
      {view === View.EMPTY && (
        <Col>
          <Typography>{t('daoInit.emptyDaoTitle')}</Typography>
          <Typography as='span'>{t('daoInit.emptyDaoSubtitle')}</Typography>
          <Typography as='span' data-qa='account' className='truncate'>
            {accountId}
          </Typography>
        </Col>
      )}
      <Col>
        <ButtonLink to={ROUTES.daoNew.path} variant='outlined'>
          {t('daoInit.createDao')}
        </ButtonLink>
        <Button variant='outlined' data-qa='logout' onClick={() => logoutClicked()}>
          {t('daoInit.logout')}
        </Button>
      </Col>
    </Portlet>
  );
};
