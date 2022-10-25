import React from 'react';
import {useTranslation} from 'react-i18next';

import {Typography} from '@roketo/core/ui/components/typography';

import styles from './empty-proposal-list.module.css';

const TextEmptyProposalList = () => {
  const {t} = useTranslation('proposal');

  return (
    <>
      {t('emptyProposalList.firstLine')}
      <br />
      {t('emptyProposalList.secondLine')}
    </>
  );
};

export const EmptyProposalList = ({
  isDefaultFiltersValue,
  createProposalComponent,
}: {
  isDefaultFiltersValue?: boolean;
  createProposalComponent: React.ReactNode;
}) => {
  const {t} = useTranslation('proposal');

  const text = isDefaultFiltersValue ? <TextEmptyProposalList /> : t('emptySearchProposalList');
  const showCreateButton = isDefaultFiltersValue;

  return (
    <div className={styles.container}>
      <Typography as='span' color='muted' align='center'>
        {text}
      </Typography>
      {showCreateButton && createProposalComponent}
    </div>
  );
};
