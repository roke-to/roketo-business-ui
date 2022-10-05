import {attach, createEvent, createStore, sample} from 'effector';

import * as employeeModel from '~/entities/employee/model/employee-model';
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

type Sort = 'name' | 'id';
export const $sort = createStore<Sort>('name');
export const sortOptions: Sort[] = ['name', 'id'];
export const sortChanged = createEvent<number>();
$sort.on(sortChanged, (_, index) => sortOptions[index]);

const loadEmployeesFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
    statusFilter: $statusFilter,
    typeFilter: $typeFilter,
    sort: $sort,
  },
  async effect({daoId, authenticationHeaders, statusFilter, typeFilter, sort}) {
    const query: {
      status?: EmployeeResponseDto['status'];
      type?: EmployeeResponseDto['type'];
      sort?: Sort;
      direction?: 'ASC' | 'DESC';
    } = {};

    if (sort === 'name') {
      query.sort = 'name';
      query.direction = 'ASC';
    } else {
      query.sort = 'id';
      query.direction = 'DESC';
    }

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

const sampleFilters = {
  isAuthHeadersExists: (authenticationHeaders: Record<string, string> | null) =>
    Boolean(authenticationHeaders?.['x-authentication-api']),
  isCurrentPathCorrect: () => window && window.location.pathname.includes(ROUTES.employees.path),
};

sample({
  source: $authenticationHeaders,
  clock: [pageLoaded, $statusFilter, $typeFilter, $sort, employeeModel.addEmployeeFx.done],
  filter: sampleFilters.isAuthHeadersExists,
  target: loadEmployeesFx,
});
sample({
  source: $authenticationHeaders,
  filter: sampleFilters.isCurrentPathCorrect,
  target: loadEmployeesFx,
});
sample({
  source: loadEmployeesFx.doneData,
  target: $employees,
});

export interface TemporaryStubForDraftInvoicesDTO {
  id: number;
  type: string;
  daoId: string;
  employeeId: number;
  employeeNearLogin: string;
  token: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
}
export const $draftInvoices = createStore<TemporaryStubForDraftInvoicesDTO[]>([]);
$draftInvoices.watch((draftInvoices) => console.log({draftInvoices}));

export const invoiceDraftModalOpened = createEvent<TemporaryStubForDraftInvoicesDTO>();
invoiceDraftModalOpened.watch((invoiceDraft) => console.log(invoiceDraft));

const loadDraftInvoicesFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({daoId, authenticationHeaders}) {
    return rbApi.dao
      .daoControllerFindAllDaoInvoices(daoId, {
        headers: {...authenticationHeaders},
      })
      .then((response) => response.data as TemporaryStubForDraftInvoicesDTO[]);
  },
});
sample({
  source: $authenticationHeaders,
  clock: [pageLoaded, employeeModel.addEmployeeFx.done],
  filter: sampleFilters.isAuthHeadersExists,
  target: loadDraftInvoicesFx,
});
sample({
  source: $authenticationHeaders,
  filter: sampleFilters.isCurrentPathCorrect,
  target: loadDraftInvoicesFx,
});
sample({
  source: loadDraftInvoicesFx.doneData,
  target: $draftInvoices,
});
