import {attach, createEffect, createEvent, createStore, sample} from 'effector';
import {createForm} from 'effector-forms';

import {$authenticationHeaders} from '~/entities/authentication-rb-api';
import {$currentDaoId} from '~/entities/wallet';
import {EmployeeResponseDto, rbApi} from '~/shared/api/rb';
import {validators} from '~/shared/lib/form/validators';
import {Employee} from '~/shared/types/employee';

export const pageLoaded = createEvent<string>();
export const $employee = createStore<EmployeeResponseDto | null>(null);
const loadEmployeeFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({daoId, authenticationHeaders}, employeeId: string) {
    return rbApi.dao
      .daoControllerFindOneEmployeeByDao(daoId, employeeId, {
        headers: {...authenticationHeaders},
      })
      .then((response) => response.data[0]);
  },
});

// TBD: тут гонка, pageLoaded случился, а $authenticationHeaders еще не засетились.
// Приходится ждать пока они засетятся и щелкнут в clock
sample({
  source: pageLoaded,
  clock: [pageLoaded, $authenticationHeaders],
  filter: (sourceData, clockData) => {
    if (typeof clockData !== 'string') {
      return Boolean(clockData?.['x-authentication-api']);
    }

    return false;
  },
  target: loadEmployeeFx,
});
sample({
  source: loadEmployeeFx.doneData,
  target: $employee,
});

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
