import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {sendTransactions} from '~/entities/proposal/model/proposal';
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
import {CreateProposalTransferFormModal} from '~/entities/treasury/ui/create-proposal-transfer-form-modal';
import {ProposalsList} from '~/entities/treasury/ui/proposals-list';
import {formatCurrency, formatYoktoValue} from '~/shared/lib/currency';
import {Button} from '~/shared/ui/components/button';
import {Chip} from '~/shared/ui/components/chip/Chip';
import {useModal} from '~/shared/ui/components/modal';
import {Typography} from '~/shared/ui/components/typography';

export const Treasury = () => {
  const {t} = useTranslation('proposal');
  const tokenBalances = useStore($tokenBalances);
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const isLoading = useStore($treasuryProposalLoading);
  const treasuryProposalSortOrder = useStore($treasuryProposalSortOrder);

  const createProposalModal = useModal();

  React.useEffect(() => {
    loadTokenBalances();
    sendTransactions();
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
      <div className='flex justify-between align-center'>
        <div className='flex flex-col gap-2'>
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
        <Button variant='soft' onClick={createProposalModal.show}>
          {t('createProposal')}
        </Button>
        <CreateProposalTransferFormModal
          isOpen={createProposalModal.isOpen}
          title={t('createProposal')}
          onCloseModal={createProposalModal.hide}
        />
      </div>
      <ProposalsFilters
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
