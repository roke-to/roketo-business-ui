import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalSort} from '~/entities/treasury/model/types/proposal-date-sort.types';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {Button} from '~/shared/ui/components/button';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as SortIcon} from '~/shared/ui/icons/sort.svg';

import styles from './filter.module.css';
import {ProposalsDateSortModal} from './modal/proposals-date-sort-modal';

const ProposalSorts: ProposalSort[] = [
  {label: 'Show new first', value: 'New', sortType: 'DESC'},
  {label: 'Show old first', value: 'Old', sortType: 'ASC'},
];

export interface ProposalDateSortProps {
  proposalSortOrder: ProposalSortOrderType;
  handleChangeProposalSortOrder(sortType: ProposalSortOrderType): void;
}

export const ProposalDateSort = ({
  proposalSortOrder,
  handleChangeProposalSortOrder,
}: ProposalDateSortProps) => {
  const {t} = useTranslation('proposalFilters');

  const sortProposalModal = useModal();

  const selected = ProposalSorts.findIndex(({sortType}) => sortType === proposalSortOrder);

  const handleChange = (index: number) => {
    handleChangeProposalSortOrder(ProposalSorts[index].sortType);
  };

  const handleChangeRadioGroup = (sortType: string) => {
    handleChangeProposalSortOrder(sortType as ProposalSortOrderType);
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
          selected={proposalSortOrder}
          onChange={handleChangeRadioGroup}
        />
      </Modal>
    </>
  );
};
