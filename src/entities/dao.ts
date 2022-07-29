import BN from 'bn.js';
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
import {history} from '~/shared/lib/router';
import {validators} from '~/shared/lib/validators';

import {$accountId, initNearInstanceFx} from './wallet';

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
      throw new Error('SputnikFactoryDaoContract not initialized');
    }

    await sputnikFactoryDaoContract.create({
      args: mapCreateArgs({...data, accountId}),
      gas: new BN('300000000000000'), // 300 TGas
      amount: new BN('6000000000000000000000000'), // 6 NEAR
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
  source: loadDaos,
  target: loadDaosFx,
});

sample({
  source: $currentDaoId,
  target: loadDaoFx,
});

//  ------------ sputnikDaoContract ------------

export const $sputnikDaoContract = createStore<SputnikDaoContract | null>(null);

const initSputnikDaoContractFx = attach({
  source: {currentDaoId: $currentDaoId},
  effect({currentDaoId}, {account}: NearInstance) {
    return currentDaoId ? new SputnikDaoContract(account, currentDaoId) : null;
  },
});

sample({
  clock: initNearInstanceFx.doneData,
  target: initSputnikDaoContractFx,
});

// TODO: on change currentDaoId recreate SputnikDaoContract

sample({
  clock: initSputnikDaoContractFx.doneData,
  target: $sputnikDaoContract,
});
