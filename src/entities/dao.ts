import BN from 'bn.js';
import decamelize from 'decamelize';
import {attach, createEffect, createEvent, createStore, forward, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {AccountDaoResponse, astroApi} from '~/shared/api/astro';
import {NearInstance} from '~/shared/api/near';
import {SputnikFactoryDaoApi} from '~/shared/api/sputnik-factory-dao/api';
import {templateCreateArgs} from '~/shared/api/sputnik-factory-dao/template-create-args';
import {ROUTES} from '~/shared/config/routes';
import {history} from '~/shared/lib/router';
import {validators} from '~/shared/lib/validators';

import {$accountId, initNearInstanceFx} from './wallet';

const $sputnikFactoryDaoApi = createStore<SputnikFactoryDaoApi | null>(null);

// TODO: pass account to walletSelector
const initSputnikFactoryDaoApiFx = createEffect(
  ({account}: NearInstance) => new SputnikFactoryDaoApi(account),
);

sample({
  clock: initNearInstanceFx.doneData,
  target: initSputnikFactoryDaoApiFx,
});

sample({
  clock: initSputnikFactoryDaoApiFx.doneData,
  target: $sputnikFactoryDaoApi,
});

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

type FormFields = typeof createDaoForm['fields'];

export const createDaoFx = attach({
  source: {
    sputnikFactoryDaoApi: $sputnikFactoryDaoApi,
    accountId: $accountId,
  },
  async effect({sputnikFactoryDaoApi, accountId}, data: FormValues<FormFields>) {
    if (!sputnikFactoryDaoApi) {
      // TODO: show error on form
      throw new Error('Contract not initialized');
    }

    try {
      const gas = new BN('300000000000000');
      // 6 NEAR
      const attachedDeposit = new BN('6000000000000000000000000');
      const args = templateCreateArgs({displayName: data.name, accountId, name: data.address});

      console.log('api', sputnikFactoryDaoApi);
      console.log('data', data);
      console.log('args', JSON.parse(atob(args)));

      // TODO: now here is error: {"index":0,"kind":{"ExecutionError":"Smart contract panicked: panicked at 'Failed to deserialize input from JSON.: Error(\"the account ID is invalid\", line: 1, column: 27)', sputnikdao-factory2/src/lib.rs:49:1"}}
      // this is redirected to near
      await sputnikFactoryDaoApi?.create({
        args: {
          name: data.name,
          args: templateCreateArgs({displayName: data.name, accountId, name: data.address}),
        },
        gas,
        amount: attachedDeposit,
      });
      // TODO: redirect to dashboard
    } catch (err) {
      console.log('err', err);
    }
  },
});

forward({
  from: createDaoForm.formValidated,
  to: createDaoFx,
});

export const $daoId = createStore<string>(localStorage.getItem('currentDaoId') || '');

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
  target: $daoId,
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

export const $selectedDao = createStore<AccountDaoResponse | null>(null);

sample({
  source: {
    daoId: $daoId,
    daos: $daos,
  },
  fn: ({daoId, daos}) => daos.find((dao) => dao.id === daoId) || null,
  target: $selectedDao,
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
  source: loadDaos,
  target: loadDaosFx,
});
