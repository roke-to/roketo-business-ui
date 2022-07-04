import {createBrowserHistory} from 'history';

import {env} from '~/shared/config/env';

export const history = createBrowserHistory({basename: env.BASE_PUBLIC_PATH});
