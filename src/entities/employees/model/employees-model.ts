import {createEffect, createEvent, createStore, sample} from 'effector';

import type {Employee} from '~/shared/types/employee';

import employeesMock from '../api/employee.mock.json';

export const pageLoaded = createEvent<void>();
export const $employees = createStore<Employee[]>([]);

const loadEmployeesFx = createEffect(() => employeesMock as Employee[]);
sample({
  source: pageLoaded,
  target: loadEmployeesFx,
});
sample({
  source: loadEmployeesFx.doneData,
  target: $employees,
});
