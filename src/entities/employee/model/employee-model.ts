import {createEffect, sample} from 'effector';
import {createForm} from 'effector-forms';

import {validators} from '~/shared/lib/validators';
import {Employee} from '~/shared/types/employee';

// TODO: add types
export const addEmployeeForm = createForm({
  fields: {
    type: {
      init: 'Freelancer',
      rules: [validators.required],
    },
    name: {
      init: '',
      rules: [validators.required],
    },
    wallet: {
      init: '',
      rules: [validators.required],
    },
    role: {
      init: '',
      rules: [validators.required],
    },
    email: {
      init: '',
      rules: [validators.required],
    },
    salary: {
      init: '',
      rules: [validators.required],
    },
    token: {
      init: 'near',
      rules: [validators.required],
    },
    comment: {
      init: '',
    },
  },
  validateOn: ['submit'],
});

export const addEmployeeFx = createEffect((data: Employee) => console.log({...data}));

sample({
  // TODO: add types
  // @ts-expect-error
  source: addEmployeeForm.formValidated,
  fn: (sourceData) => ({...sourceData, status: 'Active'}),
  target: addEmployeeFx,
});
