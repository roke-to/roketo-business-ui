import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalKind} from '~/entities/treasury/model/constants';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './filter.module.css';

export interface ProposalKindFilterProps {
  selectedProposalKind: ProposalKindFilterType;
  handleChangeProposalKind(kind: ProposalKindFilterType): void;
}

export const ProposalKindFilter = ({
  selectedProposalKind,
  handleChangeProposalKind,
}: ProposalKindFilterProps) => {
  const {t} = useTranslation('proposalFilters');

  const selected = ProposalKind.findIndex((kind) => kind === selectedProposalKind);

  const handleChange = (index: number) => {
    handleChangeProposalKind(ProposalKind[index]);
  };

  return (
    <Row align='center' gap='sm' className={styles.kindButton}>
      <Typography as='span' color='muted'>
        {t('type')}:
      </Typography>
      <DropdownMenu label={selectedProposalKind} variant='soft'>
        <DropdownContent selected={selected} handleChange={handleChange} offset='m' gap={3}>
          {ProposalKind.map((kind) => (
            <DropdownItem key={kind}>{kind}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Row>
  );
};
