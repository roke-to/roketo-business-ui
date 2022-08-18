import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {CouncilsList} from '~/entities/councils/ui/councils-list';
import {$currentDaoQuorumValue, loadDao, loadDaos} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
import {PieChart} from '~/shared/ui/components/pie-chart/pie-chart';
import {Portlet} from '~/shared/ui/components/portlet';
import {Track} from '~/shared/ui/components/range';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {VerticalLine} from '~/shared/ui/components/vertical-line';

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
    <Portlet className={styles.councilWidget}>
      <CouncilsList />

      <Row gap={3}>
        <VerticalLine className={styles.verticalLine} />
        <PieChart
          parts={[
            {
              value: quorumPercent,
              className: styles.positive,
            },
            {
              value: 100 - quorumPercent,
              className: styles.negative,
            },
          ]}
          className={styles.pieChart}
        />

        <Col gap={0}>
          <Typography as='span' font='xs' weight='bold' className={styles.textDesktop}>
            {t('quorum')}
          </Typography>
          <Typography as='span' weight='bold' font='lg' className={styles.textDesktop}>
            {quorumPercent}%
          </Typography>
          <Typography as='span' weight='bold' font='lg' className={styles.mobileDesktop}>
            {t('quorum')} {quorumPercent}%
          </Typography>
          <Track
            value={quorumPercent}
            className={styles.scaleContainerRoot}
            scaleContainer={styles.scaleContainer}
          />
        </Col>
      </Row>

      <ChangePolicyButton />
    </Portlet>
  );
};
