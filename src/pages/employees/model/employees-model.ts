import {attach, createEvent, createStore, sample} from 'effector';

import {$authenticationHeaders} from '~/entities/authentication-rb-api';
import {$currentDaoId} from '~/entities/wallet';
import {rbApi} from '~/shared/api/rb';
import type {EmployeeResponseDto} from '~/shared/api/rb';
import {ROUTES} from '~/shared/config/routes';

export const pageLoaded = createEvent<void>();
export const $employees = createStore<EmployeeResponseDto[]>([]);

type StatusFilter = 'all' | EmployeeResponseDto['status'];
export const $statusFilter = createStore<StatusFilter>('all');
export const statusFilterOptions: StatusFilter[] = ['all', 'Active', 'Suspended', 'Fired'];

export const statusFilterChanged = createEvent<number>();
$statusFilter.on(statusFilterChanged, (_, index) => statusFilterOptions[index]);

const loadEmployeesFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
    statusFilter: $statusFilter,
  },
  async effect({daoId, authenticationHeaders, statusFilter}) {
    const query: {status?: EmployeeResponseDto['status']} = {};

    if (statusFilter !== 'all') {
      query.status = statusFilter;
    }

    return rbApi.dao
      .daoControllerFindAllEmployees(daoId, query, {
        headers: {...authenticationHeaders},
      })
      .then((response) => response.data);
  },
});
sample({
  source: $authenticationHeaders,
  clock: [pageLoaded, $statusFilter],
  filter: (authenticationHeaders) => Boolean(authenticationHeaders?.['x-authentication-api']),
  target: loadEmployeesFx,
});
sample({
  source: $authenticationHeaders,
  // TODO: нужна объяснялка пояснялка
  filter: () => window && window.location.pathname.includes(ROUTES.employees.path),
  target: loadEmployeesFx,
});
sample({
  source: loadEmployeesFx.doneData,
  target: $employees,
});
