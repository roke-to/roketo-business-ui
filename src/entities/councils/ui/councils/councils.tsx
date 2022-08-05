import clsx from 'clsx';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {CouncilsList} from '~/entities/councils/ui/councils-list';
import {loadDao, loadDaos} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
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
  const rightPartScale = 100 - quorumPercent;

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
        <div className={styles.scaleContainer}>
          <div
            style={{width: `${quorumPercent}%`}}
            className={clsx(styles.rightPart, {[styles.scaleFull]: quorumPercent === 100})}
          />
          <div
            style={{width: `${rightPartScale}%`}}
            className={clsx(styles.leftPart, {[styles.scaleFull]: rightPartScale === 100})}
          />
          <div className={styles.quorumLine} />
        </div>
      </Col>

      <ChangePolicyButton />
    </div>
  );
};
