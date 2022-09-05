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

type TypeFilter = 'all' | EmployeeResponseDto['type'];
export const $typeFilter = createStore<TypeFilter>('all');
export const typeFilterOptions: TypeFilter[] = ['all', 'Freelancer', 'Contractor'];

export const typeFilterChanged = createEvent<number>();
$typeFilter.on(typeFilterChanged, (_, index) => typeFilterOptions[index]);

const loadEmployeesFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
    statusFilter: $statusFilter,
    typeFilter: $typeFilter,
  },
  async effect({daoId, authenticationHeaders, statusFilter, typeFilter}) {
    const query: {status?: EmployeeResponseDto['status']; type?: EmployeeResponseDto['type']} = {};

    if (statusFilter !== 'all') {
      query.status = statusFilter;
    }

    if (typeFilter !== 'all') {
      query.type = typeFilter;
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
  clock: [pageLoaded, $statusFilter, $typeFilter],
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
