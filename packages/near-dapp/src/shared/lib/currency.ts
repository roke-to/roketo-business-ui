import * as nearApi from 'near-api-js';
import Decimal from 'decimal.js';

export function formatYoktoValue(
  value: string,
  exponent: number = nearApi.utils.format.NEAR_NOMINATION_EXP,
): string {
  if (!value) {
    return '0';
  }

  const decimals = new Decimal(10).pow(exponent);

  return new Decimal(value).div(decimals).toDecimalPlaces(4).toString();
}

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.formatToParts(amount).reduce((acc, part) => {
    let res = acc;

    const {type} = part;

    if (type !== 'currency' && type !== 'literal') {
      res += part.value;
    }

    return res;
  }, '');
}
