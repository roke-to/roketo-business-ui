import {attach, createEffect, createEvent, createStore, sample} from 'effector';

import * as employeeModel from '~/entities/employee/model/employee-model';
import {$authenticationHeaders} from '~/entities/authentication-rb-api';
import {pageLoaded as employeePageLoaded} from '~/entities/employee/model/employee-model';
import {createTreasuryProposalForm} from '~/entities/treasury/model/treasury';
import {$currentDaoId} from '~/entities/wallet';
import {DraftInvoiceResponseDto, rbApi} from '~/shared/api/rb';
import type {EmployeeResponseDto} from '~/shared/api/rb';
import {ROUTES} from '~/shared/config/routes';
import {history} from '~/shared/lib/router';

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
  clock: [
    pageLoaded,
    $statusFilter,
    $typeFilter,
    $sort,
    employeeModel.addEmployeeFx.done,
    $currentDaoId,
  ],
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

export const $draftInvoices = createStore<DraftInvoiceResponseDto[]>([]);

export const invoiceDraftModalOpened = createEvent<DraftInvoiceResponseDto>();

const loadDraftInvoicesFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({daoId, authenticationHeaders}) {
    return rbApi.dao
      .daoControllerFindAllDaoInvoices(
        daoId,
        {status: 'Active'},
        {
          headers: {...authenticationHeaders},
        },
      )
      .then((response) => response.data);
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

// ----------------------------------------  propose draft -----------------------------

const createCallbackUrl = (invoiceId: number) => {
  const url = new URL(window.location.toString());
  url.search = `?invoiceId=${invoiceId}`;
  return url.toString();
};

sample({
  clock: invoiceDraftModalOpened,
  fn: ({id, employeeNearLogin, amount, periodStart, periodEnd}) => ({
    description: `#${id} draft invoice to pay salary from ${periodStart} to ${periodEnd}`,
    targetAccountId: employeeNearLogin,
    amount: String(amount),
    callbackUrl: createCallbackUrl(id),
  }),
  target: createTreasuryProposalForm.setForm,
});

export const setInvoiceStatusAfterRedirectFx = attach({
  source: {
    currentDaoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({currentDaoId, authenticationHeaders}) {
    const searchParams = new URLSearchParams(window.location.search);
    const invoiceId = searchParams.get('invoiceId');
    const errorCode = searchParams.get('errorCode');
    const queryKeysToRemove = ['errorCode'];

    try {
      if (invoiceId && !errorCode) {
        queryKeysToRemove.push('invoiceId');

        await rbApi.dao.daoControllerUpdateDaoDraftInvoiceStatus(
          String(invoiceId),
          currentDaoId,
          {
            status: 'Confirmed',
          },
          {
            headers: {...authenticationHeaders},
          },
        );
      }
    } catch {
      // if it not sended or error,
      // it will be updated from blockchain
    }

    return queryKeysToRemove;
  },
});

const clearUrlFx = createEffect((queryKeysToRemove: string[]) => {
  const url = new URL(window.location.toString());

  queryKeysToRemove.forEach((key) => {
    url.searchParams.delete(key);
  });

  history.replace(url);
});

sample({
  source: pageLoaded,
  clock: [pageLoaded, $authenticationHeaders],
  filter: () => Boolean($authenticationHeaders.getState()?.['x-authentication-api']),
  target: setInvoiceStatusAfterRedirectFx,
});

sample({
  source: employeePageLoaded,
  clock: [employeePageLoaded, $authenticationHeaders],
  filter: () => Boolean($authenticationHeaders.getState()?.['x-authentication-api']),
  target: setInvoiceStatusAfterRedirectFx,
});

sample({
  clock: setInvoiceStatusAfterRedirectFx.doneData,
  target: clearUrlFx,
});

sample({
  clock: setInvoiceStatusAfterRedirectFx.doneData,
  target: loadDraftInvoicesFx,
});
