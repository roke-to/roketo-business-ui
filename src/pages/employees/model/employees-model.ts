import {attach, createEvent, createStore, sample} from 'effector';

import {$authenticationHeaders} from '~/entities/authentication-rb-api';
import {$currentDaoId} from '~/entities/dao';
import {rbApi} from '~/shared/api/rb';
import {ROUTES} from '~/shared/config/routes';
import type {Employee} from '~/shared/types/employee';

export const pageLoaded = createEvent<void>();
export const $employees = createStore<Employee[]>([]);

const loadEmployeesFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async effect({daoId, authenticationHeaders}) {
    return rbApi.dao
      .daoControllerFindAllEmployees('vote4science-community.sputnikv2.testnet', {
        headers: {...authenticationHeaders},
      })
      .then((response) => response.json());
  },
});
sample({
  clock: pageLoaded,
  source: $authenticationHeaders,
  filter: (authenticationHeaders) => Boolean(authenticationHeaders?.['x-authentication-api']),
  target: loadEmployeesFx,
});
sample({
  source: $authenticationHeaders,
  filter: () => window && window.location.pathname.includes(ROUTES.employees.path),
  target: loadEmployeesFx,
});
sample({
  source: loadEmployeesFx.doneData,
  target: $employees,
});
