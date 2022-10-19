import {createEvent, sample} from "effector";
import {initWallet} from "./wallet";

export const initApp = createEvent();

sample({
  clock: initApp,
  target: initWallet,
});
