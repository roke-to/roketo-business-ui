import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalStatuses} from '~/entities/treasury/model/constants';
import {theme} from '~/shared/config/theme';
import {useMediaQuery} from '~/shared/hook/useMediaQuery';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalStatus} from '~/shared/types/proposal-status';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './filter.module.css';
import {ProposalFilterModal} from './modal/proposal-filter-modal';

export interface ProposalStatusFilterProps {
  selectedProposalStatus: ProposalStatus;
  selectedProposalKind?: ProposalKindFilterType;
  isLoading: boolean;
  handleChangeProposalStatus(status: ProposalStatus): void;
  handleChangeProposalKind?(kind: ProposalKindFilterType): void;
}

export const ProposalStatusFilter = ({
  isLoading,
  selectedProposalStatus,
  selectedProposalKind,
  handleChangeProposalStatus,
  handleChangeProposalKind,
}: ProposalStatusFilterProps) => {
  const {t} = useTranslation('proposalFilters');
  const canShowModal = useMediaQuery(`(max-width: ${theme.screens.mobile})`);

  const proposalFiltersModal = useModal();

  const selected = ProposalStatuses.findIndex((status) => status === selectedProposalStatus);

  const handleChange = (index: number) => {
    handleChangeProposalStatus(ProposalStatuses[index]);
  };

  return (
    <Row align='center' gap='sm'>
      <Typography as='span' color='muted' className={styles.statusText}>
        {t('status')}:
      </Typography>
      <DropdownMenu
        label={t(`proposalStatus.${selectedProposalStatus}`)}
        variant='soft'
        onClick={canShowModal ? proposalFiltersModal.show : undefined}
      >
        <DropdownContent selected={selected} handleChange={handleChange} offset='m' gap={3}>
          {ProposalStatuses.map((status) => (
            <DropdownItem key={status}>{t(`proposalStatus.${status}`)}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
      <Modal
        isOpen={proposalFiltersModal.isOpen}
        onCloseModal={proposalFiltersModal.hide}
        className={styles.modal}
      >
        <ProposalFilterModal
          isLoading={isLoading}
          selectedProposalStatus={selectedProposalStatus}
          selectedProposalKind={selectedProposalKind}
          handleChangeProposalStatus={handleChangeProposalStatus}
          handleChangeProposalKind={handleChangeProposalKind}
        />
      </Modal>
    </Row>
  );
};
