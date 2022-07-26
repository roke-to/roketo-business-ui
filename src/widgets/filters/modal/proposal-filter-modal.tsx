import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalKind, ProposalStatuses} from '~/features/treasury/model/constants';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalStatus} from '~/shared/types/proposal-status';
import {Divider} from '~/shared/ui/components/divider';
import {Loading} from '~/shared/ui/components/loading';
import {RadioGroup, RadioGroupItem} from '~/shared/ui/components/radio-group';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

import styles from './proposals-date-sort-modal.module.css';

export interface ProposalFilterModalProps {
  selectedProposalStatus: ProposalStatus;
  selectedProposalKind?: ProposalKindFilterType;
  isLoading: boolean;
  handleChangeProposalStatus(status: ProposalStatus): void;
  handleChangeProposalKind?(kind: ProposalKindFilterType): void;
}

export const ProposalFilterModal = ({
  selectedProposalStatus,
  selectedProposalKind,
  isLoading,
  handleChangeProposalStatus,
  handleChangeProposalKind,
}: ProposalFilterModalProps) => {
  const {t} = useTranslation('treasury');

  const onChangeProposalStatus = (status: string) => {
    handleChangeProposalStatus(status as ProposalStatus);
  };
  const onChangeProposalKind = (kind: string) => {
    handleChangeProposalKind?.(kind as ProposalKindFilterType);
  };

  const hasKindModule = selectedProposalKind && typeof handleChangeProposalKind !== undefined;

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
        value={selectedProposalStatus}
        onChange={onChangeProposalStatus}
        gap={0}
      >
        {ProposalKind.map((kind) => (
          <RadioGroupItem key={kind} value={kind} label={kind} />
        ))}
      </RadioGroup>
      {hasKindModule && (
        <>
          <Divider />
          <RadioGroup
            name='treasuryProposalStatus'
            value={selectedProposalKind}
            onChange={onChangeProposalKind}
            gap={0}
          >
            {ProposalStatuses.map((status) => (
              <RadioGroupItem key={status} value={status} label={t(`proposalStatus.${status}`)} />
            ))}
          </RadioGroup>
        </>
      )}
    </>
  );
};
