import React from 'react';
import {useTranslation} from 'react-i18next';

import {CouncilsList} from '~/entities/councils/ui/councils-list';
import {loadDao, loadDaos} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
import {Track} from '~/shared/ui/components/range';
import {Typography} from '~/shared/ui/components/typography';

import {ChangePolicyButton} from './change-policy-button';
import styles from './councils.module.css';

export const Councils = () => {
  const {t} = useTranslation('councils');

  React.useEffect(() => {
    loadDaos();
    loadDao();
  }, []);

  const quorumPercent: number = 50;

  return (
    <div className={styles.councilWidget}>
      <CouncilsList />

      <Col gap={0}>
        <Typography as='span' font='xs' color='muted' className={styles.textDesktop}>
          {t('quorum')}
        </Typography>
        <Typography as='span' weight='semibold' font='lg' className={styles.textDesktop}>
          {quorumPercent}%
        </Typography>
        <Typography as='span' weight='semibold' font='lg' className={styles.mobileDesktop}>
          {t('quorum')} {quorumPercent}%
        </Typography>
        <Track
          value={quorumPercent}
          rightPartClassName={styles.rightPart}
          leftPartClassName={styles.leftPart}
        />
      </Col>

      <ChangePolicyButton />
    </div>
  );
};
