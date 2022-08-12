import {useStore} from 'effector-react';
import React from 'react';

import '~/app/initI18n';
import {$appLoading} from '~/entities/app';
import {Routing} from '~/pages';
import '~/shared/ui/styles';

export function Root() {
  const isLoading = useStore($appLoading);

  // todo: TBD кажется тут нужен спиннер ибо при ините есть белый экран заметный глазом
  return isLoading ? null : <Routing />;
}
