import {useStore} from 'effector-react';
import React from 'react';

import {$appLoading} from '~/entities/app';
import {Routing} from '~/pages';
import '~/shared/ui/styles';

export function Root() {
  const isLoading = useStore($appLoading);

  return isLoading ? null : <Routing />;
}
