import {env} from '~/shared/config/env';

import {history as historyLib} from '@roketo/core/lib/router/history';

export const history = historyLib(env.BASE_PUBLIC_PATH);
