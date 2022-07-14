import React, {useState} from 'react';

import mockDaoList from '~/features/treasury/ui/mockDao.json';
import {DropDownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropDownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropDownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {RadioGroupItem} from '~/shared/ui/components/radio-group';

const contentRef = React.createRef<HTMLUListElement>();

export const DaoSwitcher = () => {
  React.useEffect(() => {
    // load list dao
  }, []);

  const [daoId, setDaoId] = useState(mockDaoList[0].id);
  const [daoIndex, setDaoIndex] = useState(0);

  const handleChange = (index: number) => {
    console.log('CHOOSE DAO ->', mockDaoList[index].id);
    setDaoIndex(index);
    setDaoId(mockDaoList[index].id);
  };

  return (
    <DropDownMenu label='Mydaoname' contentRef={contentRef} size='xxs' variant='clean'>
      <DropDownContent
        ref={contentRef}
        selected={daoIndex}
        handleChange={handleChange}
        gap={3}
        size='xxs'
        offset='xs'
      >
        {mockDaoList.map((dao) => {
          const {id, transactionHash} = dao;
          return (
            <DropDownItem key={transactionHash}>
              <RadioGroupItem value={id} label={id} checked={id === daoId} />
            </DropDownItem>
          );
        })}
      </DropDownContent>
    </DropDownMenu>
  );
};
