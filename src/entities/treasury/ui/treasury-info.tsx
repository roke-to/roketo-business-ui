import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {sendTransactionsFx} from '~/entities/transactions';
import {$tokenBalances, loadTokenBalances} from '~/entities/treasury/model/treasury';
import {CreateTreasuryProposalButton} from '~/entities/treasury/ui/create-treasury-proposal-button';
import {formatCurrency, formatYoktoValue} from '~/shared/lib/currency';
import {Chip} from '~/shared/ui/components/chip/Chip';
import {Line} from '~/shared/ui/components/line';
import {Portlet} from '~/shared/ui/components/portlet';
import {Typography} from '~/shared/ui/components/typography';

interface TreasuryInfoProps {
  variant?: 'default' | 'dashboard';
}

export const TreasuryInfo = ({variant = 'default'}: TreasuryInfoProps) => {
  const {t} = useTranslation('treasury');
  const tokenBalances = useStore($tokenBalances);

  React.useEffect(() => {
    loadTokenBalances();
    sendTransactionsFx();
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
    <Portlet
      type='row'
      justify='between'
      className='align-center pt-6 mobile:py-8 mobile:flex-col mobile:gap-lg'
      width='full'
    >
      <div className='flex grow flex-col gap-2'>
        <div className='flex flex-col'>
          <Typography as='span' weight='bold' color='muted' font='xs'>
            {t('totalValue')}
          </Typography>
          <Typography as='span' weight='bold' font='heading'>
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
              <Chip key={token.id}>
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
      </div>
      {variant === 'default' && (
        <>
          <Line />
          <CreateTreasuryProposalButton />
        </>
      )}
    </Portlet>
  );
};