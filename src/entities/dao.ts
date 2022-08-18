import decamelize from 'decamelize';
import {attach, createEffect, createEvent, createStore, forward, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {AccountDaoResponse, astroApi, Dao} from '~/shared/api/astro';
import {
  mapCreateOptions,
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
    councilAddress: {
      init: '',
    },
    councilList: {
      init: [] as string[],
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

const createCallbackUrl = (daoAddress: string, daoName: string) => {
  const url = new URL(window.location.toString());
  url.search = `?newDaoAddress=${daoAddress}&newDaoName=${encodeURIComponent(daoName)}`;
  return url.toString();
};

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

    await sputnikFactoryDaoContract.create(
      mapCreateOptions({
        ...data,
        accountId,
        councilList: data.councilList,
        callbackUrl: createCallbackUrl(data.address, data.name),
      }),
    );
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
  if (
    window.location.pathname === ROUTES.dao.path ||
    window.location.pathname === ROUTES.daoNew.path
  ) {
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

// user DAOs loading
const $daos = createStore<AccountDaoResponse[]>([]);
export const $daoIds = $daos.map((arr) => arr.map(({id}) => id));

const loadDaosFx = attach({
  source: {
    accountId: $accountId,
  },
  async effect({accountId}) {
    return astroApi.daoControllerDaosByAccountId(accountId);
  },
});

export const $daosLoading = createStore(true);

sample({
  clock: loadDaosFx.doneData,
  fn: () => false,
  target: $daosLoading,
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

//  ------------ after create DAO ------------

const redirectAfterCreateDaoFx = attach({
  source: {
    daoIds: $daoIds,
  },
  async effect({daoIds}) {
    const searchParams = new URLSearchParams(history.location.search);
    const newDaoAddress = searchParams.get('newDaoAddress') || '';
    const newDaoName = searchParams.get('newDaoName') || '';
    const newDaoId = `${newDaoAddress}.${env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME}`;

    if (!daoIds.includes(newDaoId)) {
      createDaoForm.fields.name.onChange(newDaoName);
      createDaoForm.fields.address.onChange(newDaoAddress);

      const url = new URL(window.location.toString());

      url.searchParams.delete('newDaoName');
      url.searchParams.delete('newDaoAddress');

      history.replace(url);

      return '';
    }

    return newDaoId;
  },
});

sample({
  clock: loadDaosFx.doneData,
  target: redirectAfterCreateDaoFx,
});

sample({
  source: redirectAfterCreateDaoFx.doneData,
  filter: (daoId) => Boolean(daoId),
  target: setDaoId,
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
