import {useStore} from 'effector-react';
import React from 'react';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {sendTransactionsFx} from '~/entities/transactions';
import {ProposalKindForTreasury} from '~/entities/treasury/model/constants';
import {
  $treasuryProposalLoading,
  $treasuryProposalSortOrder,
  $treasurySelectedProposalKind,
  $treasurySelectedProposalStatus,
  changeTreasuryProposalSelectedKind,
  changeTreasuryProposalSelectedStatus,
  changeTreasuryProposalSortOrder,
  loadTokenBalances,
} from '~/entities/treasury/model/treasury';
import {ProposalsList} from '~/entities/treasury/ui/proposals-list';
import {Col} from '~/shared/ui/components/col';

import {TreasuryInfo} from './treasury-info';

export const Treasury = () => {
  const treasurySelectedProposalStatus = useStore($treasurySelectedProposalStatus);
  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);
  const isLoading = useStore($treasuryProposalLoading);
  const treasuryProposalSortOrder = useStore($treasuryProposalSortOrder);

  React.useEffect(() => {
    loadTokenBalances();
    sendTransactionsFx();
  }, []);

  return (
    <Col gap={10}>
      <TreasuryInfo />
      <Col gap='lg'>
        <ProposalsFilters
          kindOpions={ProposalKindForTreasury}
          isLoading={isLoading}
          selectedProposalStatus={treasurySelectedProposalStatus}
          selectedProposalKind={treasurySelectedProposalKind}
          proposalSortOrder={treasuryProposalSortOrder}
          handleChangeProposalStatus={changeTreasuryProposalSelectedStatus}
          handleChangeProposalKind={changeTreasuryProposalSelectedKind}
          handleChangeProposalSortOrder={changeTreasuryProposalSortOrder}
        />
        <ProposalsList />
      </Col>
    </Col>
  );
};
