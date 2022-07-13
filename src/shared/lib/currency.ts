import Decimal from 'decimal.js';

const YOKTO_NEAR = 1000000000000000000000000;

export function formatYoktoValue(value: string, divider?: number): string {
  if (!value) {
    return '0';
  }

  const dividerValue = divider !== undefined ? 10 ** divider : YOKTO_NEAR;

  const amountYokto = new Decimal(value);

  return Number(amountYokto.div(dividerValue).toFixed(4)).toString();
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
