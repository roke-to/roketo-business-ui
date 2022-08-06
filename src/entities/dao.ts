import * as nearApi from 'near-api-js';
import decamelize from 'decamelize';
import {attach, createEffect, createEvent, createStore, forward, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {AccountDaoResponse, astroApi, Dao} from '~/shared/api/astro';
import {
  mapCreateArgs,
  NearInstance,
  SputnikDaoContract,
  SputnikFactoryDaoContract,
} from '~/shared/api/near';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';
import {getQuorumValueFromDao} from '~/shared/lib/get-quorum-value-from-dao';
import {history} from '~/shared/lib/router';
import {validators} from '~/shared/lib/validators';

import {$accountId, $near, initNearInstanceFx} from './wallet';

// ------------ sputnikFactoryDaoContract ------------

const $sputnikFactoryDaoContract = createStore<SputnikFactoryDaoContract | null>(null);

const initSputnikFactoryDaoContractFx = createEffect(
  ({account}: NearInstance) =>
    new SputnikFactoryDaoContract(account, env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME),
);

sample({
  clock: initNearInstanceFx.doneData,
  target: initSputnikFactoryDaoContractFx,
});

sample({
  clock: initSputnikFactoryDaoContractFx.doneData,
  target: $sputnikFactoryDaoContract,
});

//  ------------ createDao ------------

export const createDaoForm = createForm({
  fields: {
    name: {
      init: '',
      rules: [validators.required],
    },
    address: {
      init: '',
      // TODO: async validate address of contract
      rules: [validators.required],
    },
  },
  validateOn: ['submit'],
});

const updateAddressByNameFx = attach({
  source: createDaoForm.fields.address.$value,
  effect(prevAddress, name: string) {
    const addressFromName = decamelize(name, {separator: '-'});
    // TODO: ensure address doesn't manually changed
    createDaoForm.fields.address.onChange(addressFromName);
  },
});

forward({
  from: createDaoForm.fields.name.onChange,
  to: updateAddressByNameFx,
});

type CreateDaoFormFields = typeof createDaoForm['fields'];

export const createDaoFx = attach({
  source: {
    sputnikFactoryDaoContract: $sputnikFactoryDaoContract,
    accountId: $accountId,
  },
  async effect({sputnikFactoryDaoContract, accountId}, data: FormValues<CreateDaoFormFields>) {
    if (!sputnikFactoryDaoContract) {
      throw new Error('SputnikFactoryDaoContract is not initialized');
    }

    await sputnikFactoryDaoContract.create({
      args: mapCreateArgs({...data, accountId}),
      gas: nearApi.DEFAULT_FUNCTION_CALL_GAS, // 300 TGas
      amount: nearApi.utils.format.parseNearAmount('6'), // 6 NEAR
    });
  },
});

forward({
  from: createDaoForm.formValidated,
  to: createDaoFx,
});

//  ------------ current DAO ------------

export const $currentDaoId = createStore<string>(localStorage.getItem('currentDaoId') || '');

export const setDaoId = createEvent<string>();
const saveCurrentDaoInLsFx = createEffect((selectedDaoId: string) => {
  // todo: put ls key to the shared consts
  localStorage.setItem('currentDaoId', selectedDaoId);
  if (window.location.pathname === ROUTES.dao.path) {
    history.replace(ROUTES.treasury.path);
  }
  return selectedDaoId;
});

sample({
  source: setDaoId,
  target: saveCurrentDaoInLsFx,
});

sample({
  source: saveCurrentDaoInLsFx.doneData,
  target: $currentDaoId,
});

const SOME_DAOS_WITH_SOME_DATA_FOR_DEV = [
  'animatronic.testnet', // a lot of proposals
];

// user DAOs loading
const $daos = createStore<AccountDaoResponse[]>([]);
export const $daoIds = $daos.map((arr) =>
  arr.map(({id}) => id).concat(SOME_DAOS_WITH_SOME_DATA_FOR_DEV),
);

const loadDaosFx = attach({
  source: {
    accountId: $accountId,
  },
  async effect({accountId}) {
    return astroApi.daoControllerDaosByAccountId(accountId);
  },
});

export const loadDaos = createEvent();
export const loadDao = createEvent();

export const $currentDao = createStore<Dao | null>(null);
export const $currentDaoQuorumValue = createStore<number>(0);

const loadDaoFx = attach({
  source: {
    daoId: $currentDaoId,
  },
  async effect({daoId}) {
    return astroApi.daoControllerDaoById(daoId);
  },
});

sample({
  clock: initNearInstanceFx.doneData,
  filter: (near) => Boolean(near.accountId),
  target: loadDaosFx,
});

sample({
  source: loadDaosFx.doneData,
  fn: (response) => response.data,
  target: $daos,
});

sample({
  source: loadDaoFx.doneData,
  fn: (response) => response.data,
  target: $currentDao,
});

sample({
  source: loadDaoFx.doneData,
  fn: (response) => getQuorumValueFromDao(response.data),
  target: $currentDaoQuorumValue,
});

sample({
  source: loadDaos,
  target: loadDaosFx,
});

sample({
  source: $currentDaoId,
  target: loadDaoFx,
});

sample({
  source: loadDao,
  target: loadDaoFx,
});

//  ------------ sputnikDaoContract ------------

export const $sputnikDaoContract = createStore<SputnikDaoContract | null>(null);

const initSputnikDaoContractFx = attach({
  source: {
    currentDaoId: $currentDaoId,
    near: $near,
  },
  effect({currentDaoId, near}) {
    return currentDaoId && near ? new SputnikDaoContract(near.account, currentDaoId) : null;
  },
});

sample({
  clock: initNearInstanceFx.doneData,
  target: initSputnikDaoContractFx,
});

sample({
  clock: setDaoId,
  target: initSputnikDaoContractFx,
});

sample({
  clock: initSputnikDaoContractFx.doneData,
  target: $sputnikDaoContract,
});
