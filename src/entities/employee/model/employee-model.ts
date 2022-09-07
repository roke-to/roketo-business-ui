import {attach, createEffect, createEvent, sample} from 'effector';
import {createForm} from 'effector-forms';

import {$authenticationHeaders} from '~/entities/authentication-rb-api';
import {$currentDaoId} from '~/entities/wallet';
import {validators} from '~/shared/lib/form/validators';
import {Employee} from '~/shared/types/employee';

export const pageLoaded = createEvent<string>();
const loadEmployeeFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({daoId, authenticationHeaders}, params) {
    console.log({daoId, authenticationHeaders, params});
    /* return rbApi.dao
      .daoControllerFindAllEmployees(daoId, query, {
        headers: {...authenticationHeaders},
      })
      .then((response) => response.data); */
  },
});
// TBD: тут два сэмпла, потому что в первом возникает гонка, pageLoaded случился,
// а $authenticationHeaders еще не засетились
// TODO придумать решение получше
sample({
  clock: pageLoaded,
  source: $authenticationHeaders,
  filter: (sourceData) => Boolean(sourceData?.['x-authentication-api']),
  fn: (sourceData, clockData) => clockData,
  target: loadEmployeeFx,
});
sample({
  clock: $authenticationHeaders,
  source: pageLoaded,
  filter: (sourceData, clockData) => Boolean(clockData?.['x-authentication-api']),
  target: loadEmployeeFx,
});
/*
sample({
  source: loadEmployeesFx.doneData,
  target: $employees,
}); */

export type AddEmployeeFormFields = Omit<Employee, 'id' | 'status'>;
export const addEmployeeForm = createForm<AddEmployeeFormFields>({
  fields: {
    type: {
      init: 'Freelancer',
      rules: [validators.required()],
    },
    name: {
      init: '',
      rules: [validators.required()],
    },
    nearLogin: {
      init: '',
      rules: [validators.required()],
    },
    role: {
      init: '',
      rules: [validators.required()],
    },
    email: {
      init: '',
      rules: [validators.required()],
    },
    salary: {
      init: '',
      rules: [validators.required()],
    },
    startDate: {
      init: '',
      rules: [validators.required()],
    },
    period: {
      init: '2 per month',
    },
    payoutType: {
      init: 'Smooth',
    },
    token: {
      init: 'near',
      rules: [validators.required()],
    },
    comment: {
      init: '',
    },
  },
  validateOn: ['submit'],
});
export const addEmployeeFx = createEffect((data: AddEmployeeFormFields) => console.log({...data}));
sample({
  source: addEmployeeForm.formValidated,
  target: addEmployeeFx,
});
