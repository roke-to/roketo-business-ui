import {format, parseISO} from 'date-fns';
import {attach, createEvent, createStore, forward, sample} from 'effector';
import {createForm} from 'effector-forms';
import {t} from 'i18next';

import {isAccountExistFx} from '~/entities/account-exist-effect';
import {createTreasuryProposalForm} from '~/entities/treasury/model/treasury';
import {$currentDaoId} from '~/entities/wallet';
import {CreateEmployeeDto, EmployeeResponseDto, rbApi, UpdateEmployeeDto} from '~/shared/api/rb';

import {validators} from '@roketo/core/lib/form/validators';

export const pageLoaded = createEvent<string>();
export const $employee = createStore<EmployeeResponseDto | null>(null);

export const loadEmployeeFx = attach({
  source: {
    daoId: $currentDaoId,
  },
  async effect({daoId}, employeeId: string) {
    return rbApi.dao
      .daoControllerFindOneEmployeeByDao(daoId, employeeId)
      .then((response) => response[0]);
  },
});

type EmployeeStatusChangeAction = 'Suspend' | 'Reinstate' | 'Fire' | 'Rehire';
export const employeeStatusChanged = createEvent<EmployeeStatusChangeAction>();
const changeEmployeeStatusFx = attach({
  source: {
    daoId: $currentDaoId,
    employee: $employee,
  },
  async effect({daoId, employee}, action: EmployeeStatusChangeAction) {
    return rbApi.dao.daoControllerChangeEmployeeStatus(daoId, String(employee!.id), action);
  },
});

sample({
  source: employeeStatusChanged,
  target: changeEmployeeStatusFx,
});

// ---------------------------------------- create employee -----------------------------

export const $isCreateEmployeeModalOpen = createStore<boolean>(false);

export interface AddEmployeeFormFields
  extends Omit<CreateEmployeeDto, 'status' | 'daoId' | 'amount' | 'payPeriod'> {
  amount: string;
  payPeriod: string;
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
      init: '2',
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
  },
  async effect({daoId}, formData: AddEmployeeFormFields) {
    // черновой вариант, много несостыковок между формой и моделью в апи
    const {
      // TODO  в api это number, в ui пока нет инпута под числа, приходится кастить перед отправкой
      amount,

      // TODO так же как и в amount
      payPeriod,

      ...restForm
    } = formData;

    const data: CreateEmployeeDto = {
      daoId,
      status: 'Active',
      amount: Number(amount) || 0,
      payPeriod: Number(payPeriod) || 2,
      ...restForm,
    };
    return rbApi.dao.daoControllerCreateEmployee(daoId, data);
  },
});
sample({
  source: addEmployeeForm.formValidated,
  target: addEmployeeFx,
});
sample({
  source: addEmployeeFx.doneData,
  target: addEmployeeForm.resetValues,
});

forward({
  from: addEmployeeForm.fields.nearLogin.$value,
  to: isAccountExistFx,
});

sample({
  clock: isAccountExistFx.doneData,
  source: {
    errors: addEmployeeForm.fields.nearLogin.$errors,
    nearLogin: addEmployeeForm.fields.nearLogin.$value,
  },
  fn({nearLogin, errors}, isNearLoginExist) {
    if (!isNearLoginExist && Boolean(nearLogin)) {
      return [
        ...errors,
        {
          rule: 'accountIdExist',
          value: nearLogin,
          errorText: t('proposal:createForm.accountNotExists'),
        },
      ];
    }
    return errors;
  },
  target: addEmployeeForm.fields.nearLogin.$errors,
});

// ---------------------------------------- update employee -----------------------------

export const $isUpdateEmployeeModalOpen = createStore<boolean>(false);
export const toggleUpdateEmployeeModal = createEvent();
$isUpdateEmployeeModalOpen.on(toggleUpdateEmployeeModal, (isOpen) => !isOpen);

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
      init: '2',
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
sample({
  source: $employee,
  clock: $isUpdateEmployeeModalOpen,
  filter: (sourceValue, clockValue) => clockValue,
  fn: (source) => ({
    name: source!.name,
    status: source!.status,
    nearLogin: source!.nearLogin,
    email: source!.email,
    amount: source!.salary.toString(),
    position: source!.position,
    startDate: format(parseISO(source!.startDate), 'yyyy-MM-dd'),
    payPeriod: source!.payPeriod.toString(),
    token: source!.token,
    comment: source!.comment,
  }),
  target: updateEmployeeForm.setForm,
});

export const updateEmployeeFx = attach({
  source: {
    daoId: $currentDaoId,
    employee: $employee,
  },
  async effect({daoId, employee}, formData: UpdateEmployeeFormFields) {
    // черновой вариант, много несостыковок между формой и моделью в апи
    const {
      // TODO  в api это number, в ui пока нет инпута под числа, приходится кастить перед отправкой
      amount,

      // TODO так же как и в amount
      payPeriod,

      ...restForm
    } = formData;

    const data: UpdateEmployeeDto = {
      daoId,
      type: employee!.type,
      amount: Number(amount) || 0,
      payPeriod: Number(payPeriod) || 2,
      ...restForm,
    };
    return rbApi.dao.daoControllerUpdateEmployee(daoId, String(employee!.id), data);
  },
});

sample({
  source: updateEmployeeForm.formValidated,
  target: updateEmployeeFx,
});
sample({
  clock: updateEmployeeFx.done,
  target: [toggleUpdateEmployeeModal, updateEmployeeForm.reset],
});

// -------------------------------------- transfer to employee -----------------------------
export const $isTransferToEmployeeModalOpen = createStore<boolean>(false);
export const toggleTransferToEmployeeModal = createEvent();
$isTransferToEmployeeModalOpen.on(toggleTransferToEmployeeModal, (isOpen) => !isOpen);

sample({
  source: $employee,
  clock: toggleTransferToEmployeeModal,
  fn: (sourceData) => ({
    targetAccountId: sourceData!.nearLogin,
  }),
  target: createTreasuryProposalForm.setForm,
});

// -------------------------------------- general page loading logic -----------------------------

sample({
  source: pageLoaded,
  clock: [pageLoaded, changeEmployeeStatusFx.doneData, updateEmployeeFx.doneData],
  target: loadEmployeeFx,
});
sample({
  source: loadEmployeeFx.doneData,
  target: $employee,
});
