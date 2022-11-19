import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {CouncilsList} from '~/entities/councils/ui/councils-list';
import {$currentDaoQuorumValue, loadDao, loadDaos} from '~/entities/dao';

import {theme} from '@roketo/core/config/theme';
import {Col} from '@roketo/core/ui/components/col';
import {Line} from '@roketo/core/ui/components/line';
import {PieChart} from '@roketo/core/ui/components/pie-chart/pie-chart';
import {Portlet} from '@roketo/core/ui/components/portlet';
import {Track} from '@roketo/core/ui/components/range';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

import {ChangePolicyButton} from './change-policy-button';
import styles from './councils.module.css';

interface CouncilsProps {
  variant?: 'default' | 'dashboard';
}

export const Councils: React.FC<CouncilsProps> = ({variant = 'default', children}) => {
  const {t} = useTranslation('councils');
  const quorumPercent = useStore($currentDaoQuorumValue);

  React.useEffect(() => {
    loadDaos();
    loadDao();
  }, []);

  return (
    <Portlet className={styles.councilWidget}>
      <CouncilsList />

      <Row gap={6}>
        <Line className={styles.verticalLine} />
        <PieChart
          parts={[
            {
              value: quorumPercent,
              fill: theme.colors.green.light,
            },
            {
              value: 100 - quorumPercent,
              fill: theme.colors.red.light,
            },
          ]}
          className={styles.pieChart}
        />

        <Col gap={0} className={styles.quorumContainer}>
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

      {variant === 'default' && <ChangePolicyButton />}
      {variant !== 'default' && children}
    </Portlet>
  );
};
