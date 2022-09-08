import {useStore} from 'effector-react';
import React from 'react';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {
  $streamProposalLoading,
  $streamProposalSortOrder, // $streamSelectedProposalKind,
  $streamSelectedProposalStatus,
  changeStreamProposalSelectedKind,
  changeStreamProposalSelectedStatus,
  changeStreamProposalSortOrder,
} from '~/entities/streams/model';
import {sendTransactionsFx} from '~/entities/transactions';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

// import {ProposalKindForStream} from '~/entities/treasury/model/constants';
import {ProposalsList} from './proposals-list';

export const StreamProposals = () => {
  const streamSelectedProposalStatus = useStore($streamSelectedProposalStatus);
  // const streamSelectedProposalKind = useStore($streamSelectedProposalKind);
  const isLoading = useStore($streamProposalLoading);
  const streamProposalSortOrder = useStore($streamProposalSortOrder);

  React.useEffect(() => {
    sendTransactionsFx();
  }, []);

  // TODO: streamSelectedProposalKind === 'Any' &&
  const isDefaultFiltersValue = streamSelectedProposalStatus === 'all';

  return (
    <>
      <Row align='center' justify='between'>
        <Typography as='span' font='heading'>
          Stream proposals
        </Typography>
      </Row>
      <ProposalsFilters
        // setKindProposal={ProposalKindForStream}
        isLoading={isLoading}
        selectedProposalStatus={streamSelectedProposalStatus}
        // selectedProposalKind={streamSelectedProposalKind}
        proposalSortOrder={streamProposalSortOrder}
        handleChangeProposalStatus={changeStreamProposalSelectedStatus}
        handleChangeProposalKind={changeStreamProposalSelectedKind}
        handleChangeProposalSortOrder={changeStreamProposalSortOrder}
      />
      <ProposalsList isDefaultFiltersValue={isDefaultFiltersValue} />
    </>
  );
};
