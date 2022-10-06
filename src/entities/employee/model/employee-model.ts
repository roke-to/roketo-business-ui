import {attach, createEvent, createStore, sample} from 'effector';
import {createForm} from 'effector-forms';

import {$authenticationHeaders} from '~/entities/authentication-rb-api';
import {$currentDaoId} from '~/entities/wallet';
import {CreateEmployeeDto, EmployeeResponseDto, rbApi, UpdateEmployeeDto} from '~/shared/api/rb';
import {validators} from '~/shared/lib/form/validators';

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

type EmployeeStatusChangeAction = 'Suspend' | 'Reinstate' | 'Fire' | 'Rehire';
export const employeeStatusChanged = createEvent<EmployeeStatusChangeAction>();
const changeEmployeeStatusFx = attach({
  source: {
    daoId: $currentDaoId,
    employee: $employee,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({daoId, employee, authenticationHeaders}, action: EmployeeStatusChangeAction) {
    return rbApi.dao.daoControllerChangeEmployeeStatus(daoId, String(employee!.id), action, {
      headers: {...authenticationHeaders},
    });
  },
});

// TBD: тут гонка, pageLoaded случился, а $authenticationHeaders еще не засетились.
// Приходится ждать пока они засетятся и щелкнут в clock
sample({
  source: pageLoaded,
  clock: [pageLoaded, $authenticationHeaders, changeEmployeeStatusFx.doneData],
  filter: () => Boolean($authenticationHeaders.getState()?.['x-authentication-api']),
  target: loadEmployeeFx,
});
sample({
  source: loadEmployeeFx.doneData,
  target: $employee,
});

sample({
  source: employeeStatusChanged,
  target: changeEmployeeStatusFx,
});

export const $isCreateEmployeeModalOpen = createStore<boolean>(false);
export const toggleCreateEmployeeModal = createEvent();
$isCreateEmployeeModalOpen.on(toggleCreateEmployeeModal, (isOpen) => !isOpen);

export interface AddEmployeeFormFields
  extends Omit<CreateEmployeeDto, 'status' | 'daoId' | 'amount' | 'payPeriod'> {
  amount: string;
  payPeriod: string;
  payoutType: 'Smooth';
}
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
    email: {
      init: '',
      rules: [validators.required()],
    },
    amount: {
      init: '',
      rules: [validators.required()],
    },
    position: {
      init: '',
    },
    startDate: {
      init: '',
    },
    payPeriod: {
      init: '',
    },
    // TODO нужно подумать как модель поудобнее сделать
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
export const addEmployeeFx = attach({
  source: {
    daoId: $currentDaoId,
    authenticationHeaders: $authenticationHeaders,
  },
  async effect({daoId, authenticationHeaders}, formData: AddEmployeeFormFields) {
    // черновой вариант, много несостыковок между формой и моделью в апи
    const {
      // TODO  в api это number, в ui пока нет инпута под числа, приходится кастить перед отправкой
      amount,

      // TODO так же как и в amount
      payPeriod,

      // TODO нужно добавить колонку в базу
      payoutType,

      ...restForm
    } = formData;

    const data: CreateEmployeeDto = {
      daoId,
      status: 'Active',
      amount: Number(amount) || 0,
      payPeriod: 2,
      ...restForm,
    };
    return rbApi.dao.daoControllerCreateEmployee(daoId, data, {
      headers: {...authenticationHeaders},
    });
  },
});
sample({
  source: addEmployeeForm.formValidated,
  target: addEmployeeFx,
});
sample({
  clock: addEmployeeFx.done,
  target: toggleCreateEmployeeModal,
});

export interface UpdateEmployeeFormFields
  extends Omit<UpdateEmployeeDto, 'type' | 'amount' | 'payPeriod' | 'daoId'> {
  amount: string;
  payPeriod: string;
}
export const updateEmployeeForm = createForm<UpdateEmployeeFormFields>({
  fields: {
    name: {
      init: '',
      rules: [validators.required()],
    },
    status: {
      init: 'Active',
      rules: [validators.required()],
    },
    nearLogin: {
      init: '',
      rules: [validators.required()],
    },
    email: {
      init: '',
      rules: [validators.required()],
    },
    amount: {
      init: '',
      rules: [validators.required()],
    },
    position: {
      init: '',
    },
    startDate: {
      init: '',
    },
    payPeriod: {
      init: '',
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
