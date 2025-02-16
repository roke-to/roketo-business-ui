import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalSort} from '~/entities/treasury/model/types/proposal-date-sort.types';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';

import {Loading} from '@roketo/core/ui/components/loading';
import {RadioGroup, RadioGroupItem} from '@roketo/core/ui/components/radio-group';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

import styles from './proposals-date-sort-modal.module.css';

export const ProposalsDateSortModal = ({
  values,
  selected,
  onChange,
}: {
  values: ProposalSort[];
  selected: ProposalSortOrderType;
  onChange(value: string): void;
}) => {
  const {t} = useTranslation('proposalFilters');

  return (
    <>
      <Row className={styles.header} align='center' justify='between'>
        <Typography as='h1' font='2xl'>
          {t('sortModal')}:
        </Typography>
        <Loading isLoading />
      </Row>
      <RadioGroup name='treasuryProposalSortOrder' value={selected} onChange={onChange} gap={0}>
        {values.map(({label, sortType}) => (
          <RadioGroupItem key={sortType} value={sortType} label={label} />
        ))}
      </RadioGroup>
    </>
  );
};
