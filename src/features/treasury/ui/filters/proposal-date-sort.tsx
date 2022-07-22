import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasuryProposalSortOrder,
  changeTreasuryProposalSortOrder,
  ProposalSortOrderType,
} from '~/entities/treasury';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

interface ProposalSort {
  label: string;
  value: string;
  sortType: ProposalSortOrderType;
}

const ProposalSorts: ProposalSort[] = [
  {label: 'Show new first', value: 'New', sortType: 'DESC'},
  {label: 'Show old first', value: 'Old', sortType: 'ASC'},
];

export const ProposalDateSort = () => {
  const {t} = useTranslation('treasury');

  const treasuryProposalSortOrder = useStore($treasuryProposalSortOrder);

  const selected = ProposalSorts.findIndex(({sortType}) => sortType === treasuryProposalSortOrder);

  const handleChange = (index: number) => {
    changeTreasuryProposalSortOrder(ProposalSorts[index].sortType);
  };

  return (
    <Row align='center' gap='sm'>
      <Typography as='span' color='muted'>
        {t('sort')}:
      </Typography>
      <DropdownMenu label={ProposalSorts[selected].value} variant='soft'>
        <DropdownContent
          selected={selected}
          handleChange={handleChange}
          direction='end'
          offset='m'
          gap={3}
        >
          {ProposalSorts.map(({label}) => (
            <DropdownItem key={label}>{label}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Row>
  );
};
