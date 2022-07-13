import React from 'react';
import {useTranslation} from 'react-i18next';

import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Typography} from '~/shared/ui/components/typography';

type Props = {
  userDAOs: string[];
};

export const UserHasDao = ({userDAOs}: Props) => {
  const {t} = useTranslation('dao');

  return (
    <>
      <Col>
        <Typography>{t('daoInit.hasDAOTitle')}</Typography>
        <Typography as='span'>{t('daoInit.hasDAOSubTitle')}</Typography>
      </Col>
      <Col>
        {userDAOs.map((daoID) => (
          <label key={daoID}>
            <input type='radio' name='daoID' value={daoID} />
            {daoID}
          </label>
        ))}
      </Col>
      <Col>
        <Button onClick={() => alert('select DAO feature')} variant='outlined'>
          {t('daoInit.selectDAO')}
        </Button>
      </Col>
    </>
  );
};
