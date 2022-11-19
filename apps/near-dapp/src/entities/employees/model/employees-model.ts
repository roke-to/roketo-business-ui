import {format, parseISO} from 'date-fns';

import * as employeeModel from '~/entities/employee/model/employee-model';
import {pageLoaded as employeePageLoaded} from '~/entities/employee/model/employee-model';
import {createTreasuryProposalForm} from '~/entities/treasury/model/treasury';
import {$currentDaoId} from '~/entities/wallet';
import {DraftInvoiceResponseDto, rbApi} from '~/shared/api/rb';
import type {EmployeeResponseDto} from '~/shared/api/rb';
import {history} from '~/shared/lib/router';

import {attach, createEffect, createEvent, createStore, sample} from '@roketo/core/lib/effector';

export const pageLoaded = createEvent<void>();
export const $employees = createStore<EmployeeResponseDto[]>([]);

type StatusFilter = 'all' | EmployeeResponseDto['status'];
export const $statusFilter = createStore<StatusFilter>('all');
export const statusFilterOptions: StatusFilter[] = ['all', 'Active', 'Suspended', 'Fired'];
export const statusFilterChanged = createEvent<string>();
$statusFilter.on(statusFilterChanged, (_, status) => status as StatusFilter);

type TypeFilter = 'all' | EmployeeResponseDto['type'];
export const $typeFilter = createStore<TypeFilter>('all');
export const typeFilterOptions: TypeFilter[] = ['all', 'Freelancer', 'Contractor'];
export const typeFilterChanged = createEvent<string>();
$typeFilter.on(typeFilterChanged, (_, type) => type as TypeFilter);

type Sort = 'name' | 'id';
export const $sort = createStore<Sort>('name');
export const sortOptions: Sort[] = ['name', 'id'];
export const sortChanged = createEvent<string>();
$sort.on(sortChanged, (_, sort) => sort as Sort);

const loadEmployeesFx = attach({
  source: {
    daoId: $currentDaoId,
    statusFilter: $statusFilter,
    typeFilter: $typeFilter,
    sort: $sort,
  },
  async effect({daoId, statusFilter, typeFilter, sort}) {
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

    return rbApi.dao.daoControllerFindAllEmployees(daoId, query);
  },
});

sample({
  clock: [
    pageLoaded,
    $statusFilter,
    $typeFilter,
    $sort,
    employeeModel.addEmployeeFx.done,
    $currentDaoId,
  ],
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
  },
  async effect({daoId}) {
    return rbApi.dao.daoControllerFindAllDaoInvoices(daoId, {status: 'Active'});
  },
});
sample({
  clock: [pageLoaded, employeeModel.addEmployeeFx.done],
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

const formatDate = (date: string) => format(parseISO(date), 'd MMM yyyy');

sample({
  clock: invoiceDraftModalOpened,
  fn: ({id, employeeNearLogin, amount, periodStart, periodEnd}) => ({
    description: `#${id} draft invoice to pay salary from ${formatDate(
      periodStart,
    )} to ${formatDate(periodEnd)}`,
    targetAccountId: employeeNearLogin,
    amount: String(amount),
    callbackUrl: createCallbackUrl(id),
  }),
  target: createTreasuryProposalForm.setForm,
});

export const setInvoiceStatusAfterRedirectFx = attach({
  source: {
    currentDaoId: $currentDaoId,
  },
  async effect({currentDaoId}) {
    const searchParams = new URLSearchParams(window.location.search);
    const invoiceId = searchParams.get('invoiceId');
    const errorCode = searchParams.get('errorCode');
    const queryKeysToRemove = ['errorCode'];

    try {
      if (invoiceId && !errorCode) {
        queryKeysToRemove.push('invoiceId');

        await rbApi.dao.daoControllerUpdateDaoDraftInvoiceStatus(currentDaoId, Number(invoiceId), {
          status: 'Confirmed',
        });
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
  target: setInvoiceStatusAfterRedirectFx,
});

sample({
  source: employeePageLoaded,
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
