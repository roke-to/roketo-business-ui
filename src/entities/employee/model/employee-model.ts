import {createEffect, createEvent, sample} from 'effector';
import {createForm} from 'effector-forms';

import {validators} from '~/shared/lib/form/validators';
import {Employee} from '~/shared/types/employee';

export const pageLoaded = createEvent<string>();

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
