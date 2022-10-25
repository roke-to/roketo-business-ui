import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalVariantFilterType} from '~/shared/types/proposal-variant-filter-type';

import {DropdownMenu} from '@roketo/core/ui/components/dropdown-menu';
import {DropdownContent} from '@roketo/core/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '@roketo/core/ui/components/dropdown-menu/dropdown-item';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

import styles from './filter.module.css';

export interface ProposalKindFilterProps {
  options: ProposalVariantFilterType[];
  selectedProposalKind: ProposalVariantFilterType;
  onChange(kind: ProposalVariantFilterType): void;
}

export const ProposalVariantFilter = ({
  options,
  selectedProposalKind,
  onChange,
}: ProposalKindFilterProps) => {
  const {t} = useTranslation('proposalFilters');

  const selected = options.findIndex((kind) => kind === selectedProposalKind);

  const handleChange = (index: number) => {
    onChange(options[index]);
  };

  return (
    <Row align='center' gap='sm' className={styles.kindButton}>
      <Typography as='span' color='muted'>
        {t('type')}:
      </Typography>
      <DropdownMenu label={selectedProposalKind} variant='soft'>
        <DropdownContent selected={selected} handleChange={handleChange} offset='m' gap={3}>
          {options.map((kind) => (
            <DropdownItem key={kind}>{kind}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Row>
  );
};
