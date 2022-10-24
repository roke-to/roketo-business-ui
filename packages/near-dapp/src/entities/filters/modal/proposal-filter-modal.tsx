import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalStatuses} from '~/entities/treasury/model/constants';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';
import {Divider} from 'ui/components/divider';
import {Loading} from 'ui/components/loading';
import {RadioGroup, RadioGroupItem} from 'ui/components/radio-group';
import {Row} from 'ui/components/row';
import {Typography} from 'ui/components/typography';

import styles from './proposals-date-sort-modal.module.css';

export interface ProposalFilterModalProps {
  selectedProposalStatus: ProposalStatusFilterType;
  selectedProposalKind?: ProposalKindFilterType;
  isLoading: boolean;
  kindOptions: ProposalKindFilterType[];
  onChangeStatus(status: ProposalStatusFilterType): void;
  onChangeKind?(kind: ProposalKindFilterType): void;
}

export const ProposalFilterModal = ({
  kindOptions,
  selectedProposalStatus,
  selectedProposalKind,
  isLoading,
  onChangeStatus,
  onChangeKind,
}: ProposalFilterModalProps) => {
  const {t} = useTranslation('proposalFilters');

  const onChangeProposalStatus = (status: string) => {
    onChangeStatus(status as ProposalStatusFilterType);
  };
  const onChangeProposalKind = (kind: string) => {
    onChangeKind?.(kind as ProposalKindFilterType);
  };

  const hasKindModule = selectedProposalKind && onChangeKind;

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
        value={selectedProposalKind}
        onChange={onChangeProposalKind}
        gap={0}
      >
        {kindOptions.map((kind) => (
          <RadioGroupItem key={kind} value={kind} label={kind} />
        ))}
      </RadioGroup>
      {hasKindModule && (
        <>
          <Divider />
          <RadioGroup
            name='treasuryProposalStatus'
            value={selectedProposalStatus}
            onChange={onChangeProposalStatus}
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
