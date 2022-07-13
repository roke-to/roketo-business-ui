import React, {useState} from 'react';

import mockDaoList from '~/features/treasury/ui/mockDao.json';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';

export const MockDaoList = () => {
  const [daoId, setDaoId] = useState(mockDaoList[0].id);

  const handleChange = (value: string) => {
    console.log('CHOOSE DAO ->', value);
    setDaoId(value);
  };

  return (
    <RadioGroup name='daoName' value={daoId} onChange={handleChange}>
      {mockDaoList.map((dao) => {
        const {id, transactionHash} = dao;
        return <RadioGroupItem key={transactionHash} value={id} label={id} />;
      })}
    </RadioGroup>
  );
};
