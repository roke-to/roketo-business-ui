import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasuryProposalLoading,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
  changeTreasuryProposalSelectedKind,
  changeTreasuryProposalSelectedStatus,
  ProposalKindFilterType,
  TreasuryProposalStatus,
} from '~/entities/treasury';
import {ProposalKind, ProposalStatuses} from '~/features/treasury/model/constants';
import {Divider} from '~/shared/ui/components/divider';
import {Loading} from '~/shared/ui/components/loading';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './proposals-date-sort-modal.module.css';

export const ProposalFilterModal = () => {
  const {t} = useTranslation('treasury');

  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const isLoading = useStore($treasuryProposalLoading);

  const handleChangeTreasuryProposalStatus = (status: string) => {
    changeTreasuryProposalSelectedStatus(status as TreasuryProposalStatus);
  };
  const handleChangeTreasuryProposalKind = (kind: string) => {
    changeTreasuryProposalSelectedKind(kind as ProposalKindFilterType);
  };
  return (
    <>
      <Row className={styles.header} align='center' justify='between'>
        <Typography as='h1' font='2xl'>
          {t('showProposals')}:
        </Typography>
        <Loading isLoading={isLoading} />
      </Row>
      <RadioGroup
        name='treasuryProposalKind'
        value={treasurySelectedProposalKind}
        onChange={handleChangeTreasuryProposalKind}
        gap={0}
      >
        {ProposalKind.map((kind) => (
          <RadioGroupItem key={kind} value={kind} label={kind} />
        ))}
      </RadioGroup>
      <Divider />
      <RadioGroup
        name='treasuryProposalStatus'
        value={treasurySelectedProposalStatus}
        onChange={handleChangeTreasuryProposalStatus}
        gap={0}
      >
        {ProposalStatuses.map((status) => (
          <RadioGroupItem key={status} value={status} label={t(`proposalStatus.${status}`)} />
        ))}
      </RadioGroup>
    </>
  );
};
