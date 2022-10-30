// ConnectionProvider
import {createEffect, createEvent, createStore, sample} from "effector";
import {Connection} from "@solana/web3.js";

export const $connection = createStore<Connection | null>(null);
export const $rpcEndpoint = $connection.map((connection) => connection ? connection.rpcEndpoint : null);
export const changeConnectionEndpoint = createEvent<string>();

const setupConnectionFx = createEffect((endpoint: string) => new Connection(endpoint, {commitment: 'confirmed'}));

sample({
  clock: changeConnectionEndpoint,
  target: setupConnectionFx,
})
sample({
  clock: setupConnectionFx.doneData,
  target: $connection,
})

// //ConnectionProvider
