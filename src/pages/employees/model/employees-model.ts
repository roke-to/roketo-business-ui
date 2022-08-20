import {attach, createEvent, createStore, sample} from 'effector';

import {$currentDaoId} from '~/entities/dao';
import {rbApi} from '~/shared/api/rb';
import type {Employee} from '~/shared/types/employee';

import employeesMock from '../api/employee.mock.json';

export const pageLoaded = createEvent<void>();
export const $employees = createStore<Employee[]>([]);

const loadEmployeesFx = attach({
  source: {
    daoId: $currentDaoId,
  },
  async effect() {
    return rbApi.dao.daoControllerFindAllEmployees('vote4science-community.sputnikv2.testnet', {
      headers: {'Access-Control-Allow-Origin': '*'},
    });
  },
});
sample({
  source: pageLoaded,
  target: loadEmployeesFx,
});
sample({
  source: loadEmployeesFx.doneData,
  fn: (response) => {
    console.log(response.data);
    return employeesMock as Employee[];
  },
  target: $employees,
});
