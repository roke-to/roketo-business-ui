import React from 'react';
import {useHistory} from 'react-router-dom';

import {DaoNew} from '~/features/dao/ui/dao-new';
import {ROUTES} from '~/shared/config/routes';
import {Portlet} from '~/shared/ui/components/portlet';

export const DaoNewPortlet = () => {
  const history = useHistory();

  return (
    <Portlet gap='md' className='pb-12 mobile:pb-8'>
      <DaoNew onReset={() => history.push(ROUTES.dao.path)} />
    </Portlet>
  );
};
