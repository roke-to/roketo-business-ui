import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$isMobileScreen} from '~/entities/screens';
import {Typography} from '~/shared/ui/components/typography';

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
  const isMobileWidth = useStore($isMobileScreen);

  const text = isDefaultFiltersValue ? <TextEmptyProposalList /> : t('emptySearchProposalList');
  const showCreateButton = isDefaultFiltersValue || isMobileWidth;

  return (
    <div className={styles.container}>
      <Typography as='span' color='muted' align='center'>
        {text}
      </Typography>
      {showCreateButton && createProposalComponent}
    </div>
  );
};
