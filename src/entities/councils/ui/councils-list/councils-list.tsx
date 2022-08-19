import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$currentDao} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
import {PartVisibleList} from '~/shared/ui/components/part-visible-list';
import {Typography} from '~/shared/ui/components/typography';

import styles from './councils-list.module.css';

const renderOptions = (councilAccountId: string) => (
  <Typography as='span' font='sm' key={councilAccountId}>
    {councilAccountId}
  </Typography>
);

export const CouncilsList = () => {
  const {t} = useTranslation('councils');
  const currentDao = useStore($currentDao);

  return (
    <Col gap={1}>
      <Typography as='span' weight='bold'>
        {t('councils')}
      </Typography>
      <Col gap={2}>
        <PartVisibleList
          options={currentDao?.council || []}
          renderOptions={renderOptions}
          showAllText={t('viewAll')}
          showLessText={t('viewLess')}
          maxVisibleCount={2}
          showMoreClassName={styles.viewAll}
        />
      </Col>
    </Col>
  );
};
