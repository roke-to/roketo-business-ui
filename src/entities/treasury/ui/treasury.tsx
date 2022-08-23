import {useStore} from 'effector-react';
import React from 'react';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {sendTransactionsFx} from '~/entities/transactions';
import {ProposalKindForTreasury} from '~/entities/treasury/model/constants';
import {
  $tokenBalances,
  $treasuryProposalLoading,
  $treasuryProposalSortOrder,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
  changeTreasuryProposalSelectedKind,
  changeTreasuryProposalSelectedStatus,
  changeTreasuryProposalSortOrder,
  loadTokenBalances,
} from '~/entities/treasury/model/treasury';
import {CreateProposalTransferButton} from '~/entities/treasury/ui/create-proposal-transfer-button';
import {ProposalsList} from '~/entities/treasury/ui/proposals-list';
import {formatCurrency, formatYoktoValue} from '~/shared/lib/currency';
import {Chip} from '~/shared/ui/components/chip/Chip';
import {Portlet} from '~/shared/ui/components/portlet';
import {Typography} from '~/shared/ui/components/typography';
import {VerticalLine} from '~/shared/ui/components/vertical-line';

export const Treasury = () => {
  const tokenBalances = useStore($tokenBalances);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const isLoading = useStore($treasuryProposalLoading);
  const treasuryProposalSortOrder = useStore($treasuryProposalSortOrder);

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
    <>
      <Portlet
        type='row'
        justify='between'
        className='align-center pt-6 mobile:py-8 mobile:flex-col mobile:gap-lg'
        width='full'
      >
        <div className='flex grow flex-col gap-2'>
          <div className='flex flex-col'>
            <Typography as='span' weight='bold' color='muted' font='xs'>
              Total value FT
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
        <VerticalLine />
        <CreateProposalTransferButton />
      </Portlet>
      <ProposalsFilters
        setKindProposal={ProposalKindForTreasury}
        isLoading={isLoading}
        selectedProposalStatus={treasurySelectedProposalStatus}
        selectedProposalKind={treasurySelectedProposalKind}
        proposalSortOrder={treasuryProposalSortOrder}
        handleChangeProposalStatus={changeTreasuryProposalSelectedStatus}
        handleChangeProposalKind={changeTreasuryProposalSelectedKind}
        handleChangeProposalSortOrder={changeTreasuryProposalSortOrder}
      />
      <ProposalsList />
    </>
  );
};
