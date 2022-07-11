import React, {useState} from 'react';

import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropDownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Typography} from '~/shared/ui/components/typography';

const ProposalSort = [
  {label: 'Show new first', value: 'New'},
  {label: 'Show old first', value: 'Old'},
];

const contentRef = React.createRef<HTMLUListElement>();

export const ProposalDateSort = () => {
  const [selected, setSelected] = useState(0);

  const handleChange = (n: number) => {
    console.log('SORT ->', ProposalSort[n]);
    setSelected(n);
  };

  return (
    <>
      <Typography as='span' color='muted'>
        Sort:
      </Typography>
      <DropdownMenu label={ProposalSort[selected].value} contentRef={contentRef} variant='soft'>
        <DropdownContent
          ref={contentRef}
          selected={selected}
          handleChange={handleChange}
          direction='end'
          offset='m'
        >
          {ProposalSort.map(({label}) => (
            <DropDownItem key={label}>{label}</DropDownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </>
  );
};
