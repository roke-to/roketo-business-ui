import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasurySelectedProposalStatus,
  changeTreasuryProposalSelectedStatus,
  TreasuryProposalStatus,
} from '~/entities/treasury';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

const ProposalStatuses: TreasuryProposalStatus[] = ['all', 'active', 'approved', 'failed'];

export const ProposalStatusFilter = () => {
  const {t} = useTranslation('treasury');

  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);

  const selected = ProposalStatuses.findIndex(
    (status) => status === treasurySelectedProposalStatus,
  );

  const handleChange = (index: number) => {
    changeTreasuryProposalSelectedStatus(ProposalStatuses[index]);
  };

  return (
    <Row align='center' gap='sm'>
      <Typography as='span' color='muted'>
        {t('status')}:
      </Typography>
      <DropdownMenu label={t(`proposalStatus.${treasurySelectedProposalStatus}`)} variant='soft'>
        <DropdownContent selected={selected} handleChange={handleChange} offset='m' gap={3}>
          {ProposalStatuses.map((status) => (
            <DropdownItem key={status}>{t(`proposalStatus.${status}`)}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Row>
  );
};
