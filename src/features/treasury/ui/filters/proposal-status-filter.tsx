import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasurySelectedProposalStatus,
  changeTreasuryProposalSelectedStatus,
} from '~/entities/treasury';
import {ProposalStatuses} from '~/features/treasury/model/constants';
import styles from '~/features/treasury/ui/filters/filter.module.css';
import {ProposalFilterModal} from '~/features/treasury/ui/filters/modal/proposal-filter-modal';
import {theme} from '~/shared/config/theme';
import {useMediaQuery} from '~/shared/hook/useMediaQuery';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Modal, useModal} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

export const ProposalStatusFilter = () => {
  const {t} = useTranslation('treasury');
  const canShowModal = useMediaQuery(`(max-width: ${theme.screens.mobile})`);

  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);
  const proposalFiltersModal = useModal();

  const selected = ProposalStatuses.findIndex(
    (status) => status === treasurySelectedProposalStatus,
  );

  const handleChange = (index: number) => {
    changeTreasuryProposalSelectedStatus(ProposalStatuses[index]);
  };

  return (
    <Row align='center' gap='sm'>
      <Typography as='span' color='muted' className={styles.statusText}>
        {t('status')}:
      </Typography>
      <DropdownMenu
        label={t(`proposalStatus.${treasurySelectedProposalStatus}`)}
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
        <ProposalFilterModal />
      </Modal>
    </Row>
  );
};
