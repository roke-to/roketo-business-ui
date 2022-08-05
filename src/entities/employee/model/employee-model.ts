import {createEffect, forward} from 'effector';
import {createForm} from 'effector-forms';

import {validators} from '~/shared/lib/validators';

export const addEmployeeForm = createForm({
  fields: {
    type: {
      init: 'Freelancer',
      rules: [validators.required],
    },
    target: {
      init: '',
      rules: [validators.required],
    },
    amount: {
      init: '',
      rules: [validators.required],
    },
    token: {
      init: 'near',
      rules: [validators.required],
    },
    description: {
      init: '',
    },
    link: {
      init: '',
    },
    tgas: {
      init: '150',
      rules: [validators.required],
    },
  },
  validateOn: ['submit'],
});

export const addEmployeeFx = createEffect();

forward({
  from: addEmployeeForm.formValidated,
  to: addEmployeeFx,
});
