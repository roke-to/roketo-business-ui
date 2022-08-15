import BN from 'bn.js';

export const COUNCIL = 'council';
export const ATTACHED_DEPOSIT = '0.1';
// @see https://github.com/near/near-api-js/blob/master/packages/near-api-js/src/constants.ts#L9
export const DEFAULT_FUNCTION_CALL_GAS = 300;
export const DEFAULT_FUNCTION_CALL_GAS_BN = new BN(DEFAULT_FUNCTION_CALL_GAS * 10 ** 12);
export const DATA_SEPARATOR = '$$$$';
