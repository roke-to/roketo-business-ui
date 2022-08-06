import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {CouncilsList} from '~/entities/councils/ui/councils-list';
import {$currentDaoQuorumValue, loadDao, loadDaos} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
import {Track} from '~/shared/ui/components/range';
import {Typography} from '~/shared/ui/components/typography';

import {ChangePolicyButton} from './change-policy-button';
import styles from './councils.module.css';

export const Councils = () => {
  const {t} = useTranslation('councils');
  const quorumPercent = useStore($currentDaoQuorumValue);

  React.useEffect(() => {
    loadDaos();
    loadDao();
  }, []);

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
          className={styles.scaleContainerRoot}
          scaleContainer={styles.scaleContainer}
          rightPartClassName={styles.rightPart}
          leftPartClassName={styles.leftPart}
        />
      </Col>

      <ChangePolicyButton />
    </div>
  );
};
