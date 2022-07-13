import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';
import {Typography} from '~/shared/ui/components/typography';

type Props = {
  userDAOs: string[];
};

export const UserHasDao = ({userDAOs}: Props) => {
  const {t} = useTranslation('dao');
  const [selectedDaoID, setSelectedDaoID] = useState('');

  return (
    <>
      <Col>
        <Typography>{t('daoInit.hasDAOTitle')}</Typography>
        <Typography as='span'>{t('daoInit.hasDAOSubTitle')}</Typography>
      </Col>

      <Col>
        <RadioGroup name='daoID' value={selectedDaoID} onChange={setSelectedDaoID}>
          {userDAOs.map((daoID) => (
            <RadioGroupItem key={daoID} value={daoID} label={daoID} />
          ))}
        </RadioGroup>
      </Col>

      <Col>
        <Button onClick={() => alert('select DAO feature')} variant='outlined'>
          {t('daoInit.selectDAO')}
        </Button>
      </Col>
    </>
  );
};
