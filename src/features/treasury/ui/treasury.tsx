import {useStore} from 'effector-react';
import React from 'react';

import {$tokenBalances, loadTokenBalances} from '~/entities/treasury';
import {ProposalDateSort} from '~/features/treasury/ui/filters/proposal-date-sort';
import {ProposalKindFilter} from '~/features/treasury/ui/filters/proposal-kind-filter';
import {ProposalsList} from '~/features/treasury/ui/proposals-list';
import {formatCurrency, formatYoktoValue} from '~/shared/lib/currency';
import {Chip} from '~/shared/ui/components/chip/Chip';
import {Typography} from '~/shared/ui/components/typography';

import {ProposalStatusFilter} from './filters/proposal-status-filter';

export const Treasury = () => {
  const tokenBalances = useStore($tokenBalances);

  React.useEffect(() => {
    loadTokenBalances();
  }, []);

  const tokens = tokenBalances.map((item) => ({
    ...item,
    balance: formatYoktoValue(item.balance, item.decimals),
  }));

  const totalBalance = tokens.reduce(
    (sum, token) => sum + parseFloat(token.balance) * Number(token.price),
    0,
  );

  return (
    <>
      <div className='flex flex-col'>
        <Typography as='span' weight='bold' color='muted' font='xs'>
          Total value FT
        </Typography>
        <Typography as='span' weight='bold' font='2xl'>
          {formatCurrency(totalBalance)} USD
        </Typography>
      </div>
      <div className='flex gap-2'>
        {tokenBalances.map((token) => {
          const balance = formatYoktoValue(token.balance, token.decimals);
          const value = token.price
            ? `${formatCurrency(parseFloat(balance) * Number(token.price))} USD`
            : null;
          return (
            <Chip>
              <Typography as='span' weight='bold' font='xs'>
                {balance} {token.symbol}
              </Typography>
              {value && (
                <Typography as='span' weight='normal' font='xs' color='muted'>
                  {value}
                </Typography>
              )}
            </Chip>
          );
        })}
      </div>

      <div className='flex justify-between'>
        <ProposalStatusFilter />
        <div className='flex gap-2 items-center'>
          <ProposalKindFilter />
          <ProposalDateSort />
        </div>
      </div>
      <ProposalsList />
    </>
  );
};
