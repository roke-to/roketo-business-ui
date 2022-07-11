import React, {useState} from 'react';

import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropDownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';

const DaoList = [
  'mydaoname.sputnikv2.testnet',
  'anotheremydaoname.sputnikv2.testnet',
  'onemoredaoname.sputnikv2.testnet',
];

const contentRef = React.createRef<HTMLUListElement>();

export const DaoSwitcher = () => {
  React.useEffect(() => {
    // load list dao
  }, []);

  const [selected, setSelected] = useState(2);

  const handleChange = (n: number) => {
    setSelected(n);
  };

  return (
    <DropdownMenu label='Mydaoname' contentRef={contentRef} size='sm' variant='clean'>
      <DropdownContent ref={contentRef} selected={selected} handleChange={handleChange} size='sm'>
        {DaoList.map((dao) => (
          <DropDownItem key={dao}>{dao}</DropDownItem>
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
};
