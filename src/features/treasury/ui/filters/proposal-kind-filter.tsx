import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasurySelectedProposalKind,
  changeTreasuryProposalSelectedKind,
} from '~/entities/treasury';
import {ProposalKind} from '~/features/treasury/model/constants';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './filter.module.css';

export const ProposalKindFilter = () => {
  const {t} = useTranslation('treasury');

  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);

  const selected = ProposalKind.findIndex((kind) => kind === treasurySelectedProposalKind);

  const handleChange = (index: number) => {
    changeTreasuryProposalSelectedKind(ProposalKind[index]);
  };

  return (
    <Row align='center' gap='sm' className={styles.kindButton}>
      <Typography as='span' color='muted'>
        {t('type')}:
      </Typography>
      <DropdownMenu label={treasurySelectedProposalKind} variant='soft'>
        <DropdownContent selected={selected} handleChange={handleChange} offset='m' gap={3}>
          {ProposalKind.map((kind) => (
            <DropdownItem key={kind}>{kind}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Row>
  );
};
