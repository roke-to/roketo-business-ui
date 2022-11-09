import {createDomain} from 'effector';

if (!process.env.VITE_APP_NAME) {
  throw new Error('VITE_APP_NAME is not defined');
}

const effectsDomain = createDomain(process.env.VITE_APP_NAME);
effectsDomain.onCreateEffect(fx => {
  fx.failData.watch(error => {
    console.error(error)
  })
})

export const {createEvent, createStore, createEffect} = effectsDomain;

export {attach, sample, forward, combine, split} from 'effector';
export type {Effect, Store, Event} from 'effector';
