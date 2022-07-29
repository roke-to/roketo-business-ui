import BN from 'bn.js';

// https://github.com/near/near-api-js/blob/a05667361ddab208423f5a5c0e3dd0ce182b9880/src/contract.ts#L22
export interface ChangeMethodOptions<T extends object> {
  args: T;
  gas?: BN;
  amount?: BN;
  meta?: string;
  callbackUrl?: string;
}

export type ContractViewFunction<P, T = void> = (args?: P) => Promise<T>;
export type ContractChangeFunction<P extends object, T = void> = (
  args: ChangeMethodOptions<P>,
) => Promise<T>;
