import BN from 'bn.js';

type Impossible<K extends keyof any> = {
  [P in K]: never;
};

// https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined
type NoExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>;

// https://github.com/near/near-api-js/blob/a05667361ddab208423f5a5c0e3dd0ce182b9880/src/contract.ts#L22
export interface ChangeMethodOptions<T extends object> {
  args: T;
  // despite near-api-js types specified only BN, it also accepts strings
  gas?: BN | string | null;
  amount?: BN | string | null;
  meta?: string;
  callbackUrl?: string;
}

export type ContractViewFunction<P, T = void> = (args?: P) => Promise<T>;
export type ContractChangeFunction<P extends object, T = void> = <
  Options extends ChangeMethodOptions<P>,
>(
  args: NoExtraProperties<ChangeMethodOptions<P>, Options>,
) => Promise<T>;
