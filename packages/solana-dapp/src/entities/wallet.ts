// Init empty walletSelector instance on app loaded
import {createEffect, createEvent, createStore} from "effector";

export const initWallet = createEvent();

export const initSolanaInstanceFx = createEffect(async () => Promise.resolve())
export const $accountId = createStore('');
