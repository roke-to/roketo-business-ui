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
sample({
  source: pageLoaded,
  target: loadEmployeeFx,
});
/* sample({
  source: $authenticationHeaders,
  clock: [pageLoaded, $statusFilter, $typeFilter, $sort],
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
