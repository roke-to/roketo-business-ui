import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {setDaoId} from '~/entities/dao';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';
import {Typography} from '~/shared/ui/components/typography';

type Props = {
  userDAOs: string[];
};

export const UserHasDao = ({userDAOs}: Props) => {
  const {t} = useTranslation('dao');
  const [selectedDaoId, setSelectedDaoId] = useState('');

  return (
    <>
      <Col>
        <Typography>{t('daoInit.hasDAOTitle')}</Typography>
        <Typography as='span'>{t('daoInit.hasDAOSubTitle')}</Typography>
      </Col>

      <Col>
        <RadioGroup name='daoID' value={selectedDaoId} onChange={setSelectedDaoId} gap={1}>
          {userDAOs.map((daoID) => (
            <RadioGroupItem key={daoID} value={daoID} label={daoID} />
          ))}
        </RadioGroup>
      </Col>

      <Col>
        <Button
          onClick={() => setDaoId(selectedDaoId)}
          disabled={!selectedDaoId}
          variant='outlined'
        >
          {t('daoInit.selectDAO')}
        </Button>
      </Col>
    </>
  );
};
