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
import {isAccountExist} from '~/shared/api/near/is-account-exists';
import {env} from '~/shared/config/env';
import {ROUTES} from '~/shared/config/routes';
import {validators} from '~/shared/lib/form/validators';
import {getQuorumValueFromDao} from '~/shared/lib/get-quorum-value';
import {history} from '~/shared/lib/router';

import {$accountId, $currentDaoId, $near, initNearInstanceFx, setCurrentDaoId} from './wallet';

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

//  ------------ New DAO ------------

export const createDaoForm = createForm({
  fields: {
    name: {
      init: '',
      rules: [validators.required()],
    },
    address: {
      init: '',
      rules: [validators.required()],
    },
    councilAddress: {
      init: '',
    },
    councilList: {
      init: [] as string[],
    },
  },
  validateOn: ['change'],
});

const updateAddressByNameFx = attach({
  source: createDaoForm.fields.address.$value,
  effect(prevAddress, name: string) {
    const addressFromName = decamelize(name, {separator: '-'}).replace(/\s+/g, '-');
    // TODO: ensure address doesn't manually changed
    createDaoForm.fields.address.onChange(addressFromName);
  },
});

forward({
  from: createDaoForm.fields.name.onChange,
  to: updateAddressByNameFx,
});

export const $isNewDaoExists = createStore(false);
const isAccountExistsFx = createEffect(async (accountId: string) =>
  isAccountExist(`${accountId}.${env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME}`),
);

forward({
  from: createDaoForm.fields.address.$value,
  to: isAccountExistsFx,
});

forward({
  from: isAccountExistsFx.doneData,
  to: $isNewDaoExists,
});

export const $isCouncilExists = createStore(true);
const isCouncilExistsFx = createEffect(async (accountId: string) => isAccountExist(accountId));

forward({
  from: createDaoForm.fields.councilAddress.$value,
  to: isCouncilExistsFx,
});

forward({
  from: isCouncilExistsFx.doneData,
  to: $isCouncilExists,
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
  async effect(
    {sputnikFactoryDaoContract, accountId},
    {name, address, councilList}: FormValues<CreateDaoFormFields>,
  ) {
    if (!sputnikFactoryDaoContract) {
      throw new Error('SputnikFactoryDaoContract is not initialized');
    }

    await sputnikFactoryDaoContract.create(
      mapCreateOptions({
        name,
        address,
        councilList: [accountId, ...councilList],
        callbackUrl: createCallbackUrl(address, name),
      }),
    );
  },
});

forward({
  from: createDaoForm.formValidated,
  to: createDaoFx,
});

//  ------------ Current DAO ------------

const getLocalStorageDaoKey = (accountId: string) => `app:${accountId}:dao`;

const saveCurrentDaoInLsFx = attach({
  source: {
    accountId: $accountId,
  },
  effect({accountId}, selectedDaoId: string) {
    localStorage.setItem(getLocalStorageDaoKey(accountId), selectedDaoId);
    // TODO: Remove after some time, when all users would relogined
    localStorage.removeItem('currentDaoId');
  },
});

// Load initial state after near initialzed
sample({
  clock: initNearInstanceFx.doneData,
  fn: ({accountId}: NearInstance) =>
    (accountId && localStorage.getItem(getLocalStorageDaoKey(accountId))) || '',
  target: $currentDaoId,
});

sample({
  source: setCurrentDaoId,
  target: saveCurrentDaoInLsFx,
});

sample({
  source: setCurrentDaoId,
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

const checkErrorAfterCreateDaoFx = attach({
  source: {
    daoIds: $daoIds,
  },
  async effect() {
    const searchParams = new URLSearchParams(history.location.search);
    const newDaoAddress = searchParams.get('newDaoAddress') || '';
    const newDaoName = searchParams.get('newDaoName') || '';
    const errorCode = searchParams.get('errorCode');
    const newDaoId = newDaoAddress
      ? `${newDaoAddress}.${env.SPUTNIK_FACTORY_DAO_CONTRACT_NAME}`
      : '';

    // Fill form back on error
    if (newDaoAddress && errorCode) {
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

const redirectAfterCreateDaoFx = createEffect(() => {
  history.replace(ROUTES.treasury.path);
});

sample({
  clock: loadDaosFx.doneData,
  target: checkErrorAfterCreateDaoFx,
});

sample({
  source: checkErrorAfterCreateDaoFx.doneData,
  filter: (daoId) => Boolean(daoId),
  target: [setCurrentDaoId, redirectAfterCreateDaoFx],
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
  clock: setCurrentDaoId,
  target: initSputnikDaoContractFx,
});

sample({
  clock: initSputnikDaoContractFx.doneData,
  target: $sputnikDaoContract,
});
