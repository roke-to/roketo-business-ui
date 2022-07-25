import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasuryProposalSortOrder,
  changeTreasuryProposalSortOrder,
  ProposalSortOrderType,
} from '~/entities/treasury';
import {ProposalSort} from '~/features/treasury/model/types/proposal-date-sort.types';
import {ProposalsDateSortModal} from '~/features/treasury/ui/filters/modal/proposals-date-sort-modal';
import {Button} from '~/shared/ui/components/button';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as SortIcon} from '~/shared/ui/icons/sort.svg';

import styles from './filter.module.css';

const ProposalSorts: ProposalSort[] = [
  {label: 'Show new first', value: 'New', sortType: 'DESC'},
  {label: 'Show old first', value: 'Old', sortType: 'ASC'},
];

export const ProposalDateSort = () => {
  const {t} = useTranslation('treasury');

  const treasuryProposalSortOrder = useStore($treasuryProposalSortOrder);
  const sortProposalModal = useModal();

  const selected = ProposalSorts.findIndex(({sortType}) => sortType === treasuryProposalSortOrder);

  const handleChange = (index: number) => {
    changeTreasuryProposalSortOrder(ProposalSorts[index].sortType);
  };

  const handleChangeRadioGroup = (sortType: string) => {
    changeTreasuryProposalSortOrder(sortType as ProposalSortOrderType);
  };

  return (
    <>
      <Row align='center' gap='sm' className={styles.sortDateButton}>
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
      <Button
        startIcon={<SortIcon />}
        className={styles.sortDateIcon}
        onClick={sortProposalModal.show}
      />
      <Modal
        isOpen={sortProposalModal.isOpen}
        onCloseModal={sortProposalModal.hide}
        className={styles.modal}
      >
        <ProposalsDateSortModal
          values={ProposalSorts}
          selected={treasuryProposalSortOrder}
          onChange={handleChangeRadioGroup}
        />
      </Modal>
    </>
  );
};
