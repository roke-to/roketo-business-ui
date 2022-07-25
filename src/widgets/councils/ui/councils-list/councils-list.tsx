import {useStore} from 'effector-react';
import React from 'react';

import {$selectedDao} from '~/entities/dao';
import {Col} from '~/shared/ui/components/col';
import {Typography} from '~/shared/ui/components/typography';

export const CouncilsList = () => {
  const selectedDao = useStore($selectedDao);

  return (
    <Col gap={1}>
      <Typography as='span' weight='bold'>
        Councils
      </Typography>
      <Col gap={2}>
        {selectedDao?.council.map((councilAccountId) => (
          <Typography as='span' font='sm' key={councilAccountId}>
            {councilAccountId}
          </Typography>
        ))}
      </Col>
    </Col>
  );
};
