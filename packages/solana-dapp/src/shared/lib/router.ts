import {env} from '~/shared/config/env';

import {history as historyRoot} from '@roketo/core/lib/router/history';

export const history = historyRoot(env.BASE_PUBLIC_PATH);
