import {attach, createEffect, createStore, forward, sample} from 'effector';
import {createForm, FormValues} from 'effector-forms';

import {SputnikFactoryDaoApi} from '~/shared/api/sputnik-factory-dao/api';
import {validators} from '~/shared/lib/validators';

import {WalletSelector} from '@near-wallet-selector/core';

import {initWalletSelectorFx} from './wallet';

const $sputnikFactoryDaoApi = createStore<SputnikFactoryDaoApi | null>(null);

// TODO: pass account to walletSelector
const initSputnikFactoryDaoApiFx = createEffect(
  // @ts-expect-error
  (walletSelector: WalletSelector) => new SputnikFactoryDaoApi(walletSelector.account),
);

sample({
  clock: initWalletSelectorFx.doneData,
  target: initSputnikFactoryDaoApiFx,
});

export const createDaoForm = createForm({
  fields: {
    name: {
      init: '',
      rules: [validators.required],
    },
    address: {
      init: '',
      rules: [validators.required],
    },
  },
  validateOn: ['submit'],
});

type FormFields = typeof createDaoForm['fields'];

export const createDaoFx = attach({
  source: $sputnikFactoryDaoApi,
  async effect(sputnikFactoryDaoApi, data: FormValues<FormFields>) {
    try {
      const res = await sputnikFactoryDaoApi?.create({
        name: 'extg4',
        args: 'eyJwdXJwb3NlIjoiIiwiYm9uZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInZvdGVfcGVyaW9kIjoiNjA0ODAwMDAwMDAwMDAwIiwiZ3JhY2VfcGVyaW9kIjoiODY0MDAwMDAwMDAwMDAiLCJwb2xpY3kiOnsicm9sZXMiOlt7Im5hbWUiOiJjb3VuY2lsIiwic2x1ZyI6ImNvdW5jaWwiLCJraW5kIjp7Ikdyb3VwIjpbImV4dGcudGVzdG5ldCJdfSwicGVybWlzc2lvbnMiOlsiKjpGaW5hbGl6ZSIsInBvbGljeTpBZGRQcm9wb3NhbCIsImFkZF9ib3VudHk6QWRkUHJvcG9zYWwiLCJib3VudHlfZG9uZTpBZGRQcm9wb3NhbCIsInRyYW5zZmVyOkFkZFByb3Bvc2FsIiwidm90ZTpBZGRQcm9wb3NhbCIsInJlbW92ZV9tZW1iZXJfZnJvbV9yb2xlOkFkZFByb3Bvc2FsIiwiYWRkX21lbWJlcl90b19yb2xlOkFkZFByb3Bvc2FsIiwiY29uZmlnOkFkZFByb3Bvc2FsIiwiY2FsbDpBZGRQcm9wb3NhbCIsInVwZ3JhZGVfcmVtb3RlOkFkZFByb3Bvc2FsIiwidXBncmFkZV9zZWxmOkFkZFByb3Bvc2FsIiwic2V0X3ZvdGVfdG9rZW46QWRkUHJvcG9zYWwiLCJwb2xpY3k6Vm90ZUFwcHJvdmUiLCJwb2xpY3k6Vm90ZVJlamVjdCIsInBvbGljeTpWb3RlUmVtb3ZlIiwiYWRkX2JvdW50eTpWb3RlQXBwcm92ZSIsImFkZF9ib3VudHk6Vm90ZVJlamVjdCIsImFkZF9ib3VudHk6Vm90ZVJlbW92ZSIsImJvdW50eV9kb25lOlZvdGVBcHByb3ZlIiwiYm91bnR5X2RvbmU6Vm90ZVJlamVjdCIsImJvdW50eV9kb25lOlZvdGVSZW1vdmUiLCJ0cmFuc2ZlcjpWb3RlQXBwcm92ZSIsInRyYW5zZmVyOlZvdGVSZWplY3QiLCJ0cmFuc2ZlcjpWb3RlUmVtb3ZlIiwidm90ZTpWb3RlQXBwcm92ZSIsInZvdGU6Vm90ZVJlamVjdCIsInZvdGU6Vm90ZVJlbW92ZSIsInJlbW92ZV9tZW1iZXJfZnJvbV9yb2xlOlZvdGVBcHByb3ZlIiwicmVtb3ZlX21lbWJlcl9mcm9tX3JvbGU6Vm90ZVJlamVjdCIsInJlbW92ZV9tZW1iZXJfZnJvbV9yb2xlOlZvdGVSZW1vdmUiLCJhZGRfbWVtYmVyX3RvX3JvbGU6Vm90ZUFwcHJvdmUiLCJhZGRfbWVtYmVyX3RvX3JvbGU6Vm90ZVJlamVjdCIsImFkZF9tZW1iZXJfdG9fcm9sZTpWb3RlUmVtb3ZlIiwiY2FsbDpWb3RlQXBwcm92ZSIsImNhbGw6Vm90ZVJlamVjdCIsImNhbGw6Vm90ZVJlbW92ZSIsImNvbmZpZzpWb3RlQXBwcm92ZSIsImNvbmZpZzpWb3RlUmVqZWN0IiwiY29uZmlnOlZvdGVSZW1vdmUiLCJzZXRfdm90ZV90b2tlbjpWb3RlQXBwcm92ZSIsInNldF92b3RlX3Rva2VuOlZvdGVSZWplY3QiLCJzZXRfdm90ZV90b2tlbjpWb3RlUmVtb3ZlIiwidXBncmFkZV9zZWxmOlZvdGVBcHByb3ZlIiwidXBncmFkZV9zZWxmOlZvdGVSZWplY3QiLCJ1cGdyYWRlX3NlbGY6Vm90ZVJlbW92ZSIsInVwZ3JhZGVfcmVtb3RlOlZvdGVBcHByb3ZlIiwidXBncmFkZV9yZW1vdGU6Vm90ZVJlamVjdCIsInVwZ3JhZGVfcmVtb3RlOlZvdGVSZW1vdmUiXSwidm90ZV9wb2xpY3kiOnt9fSx7Im5hbWUiOiJhbGwiLCJzbHVnIjoiYWxsIiwia2luZCI6IkV2ZXJ5b25lIiwicGVybWlzc2lvbnMiOlsicG9saWN5OkFkZFByb3Bvc2FsIiwiYWRkX2JvdW50eTpBZGRQcm9wb3NhbCIsImJvdW50eV9kb25lOkFkZFByb3Bvc2FsIiwidHJhbnNmZXI6QWRkUHJvcG9zYWwiLCJ2b3RlOkFkZFByb3Bvc2FsIiwicmVtb3ZlX21lbWJlcl9mcm9tX3JvbGU6QWRkUHJvcG9zYWwiLCJhZGRfbWVtYmVyX3RvX3JvbGU6QWRkUHJvcG9zYWwiLCJjb25maWc6QWRkUHJvcG9zYWwiLCJjYWxsOkFkZFByb3Bvc2FsIiwidXBncmFkZV9yZW1vdGU6QWRkUHJvcG9zYWwiLCJ1cGdyYWRlX3NlbGY6QWRkUHJvcG9zYWwiLCJzZXRfdm90ZV90b2tlbjpBZGRQcm9wb3NhbCJdLCJ2b3RlX3BvbGljeSI6e319XSwiZGVmYXVsdF92b3RlX3BvbGljeSI6eyJ3ZWlnaHRfa2luZCI6IlJvbGVXZWlnaHQiLCJxdW9ydW0iOiIwIiwidGhyZXNob2xkIjpbMSwyXX0sInByb3Bvc2FsX2JvbmQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJwcm9wb3NhbF9wZXJpb2QiOiI2MDQ4MDAwMDAwMDAwMDAiLCJib3VudHlfYm9uZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJvdW50eV9mb3JnaXZlbmVzc19wZXJpb2QiOiI2MDQ4MDAwMDAwMDAwMDAifSwiY29uZmlnIjp7Im5hbWUiOiJleHRnNCIsInB1cnBvc2UiOiIiLCJtZXRhZGF0YSI6ImV5SnNhVzVyY3lJNlcxMHNJbVpzWVdkRGIzWmxjaUk2SWlJc0ltWnNZV2RNYjJkdklqb2lJaXdpWkdsemNHeGhlVTVoYldVaU9pSmxlSFJuTXlJc0lteGxaMkZzSWpwN0lteGxaMkZzVTNSaGRIVnpJam9pSWl3aWJHVm5ZV3hNYVc1cklqb2lJbjE5In19Cg',
      });

      console.log('api', sputnikFactoryDaoApi);
      console.log('data', data);
      console.log('res', res);
    } catch (err) {
      console.log('err', err);
    }
  },
});

forward({
  from: createDaoForm.formValidated,
  to: createDaoFx,
});
