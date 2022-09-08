import React from 'react';

import {DaoNew} from '~/features/dao/ui/dao-new';
import {Portlet} from '~/shared/ui/components/portlet';

export const DaoNewPortlet = () => (
  <Portlet gap='md' className='pb-12 mobile:pb-8'>
    <DaoNew />
  </Portlet>
);
