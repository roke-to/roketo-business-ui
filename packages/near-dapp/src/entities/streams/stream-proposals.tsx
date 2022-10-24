import {useStore} from 'effector-react';
import React from 'react';

import {ProposalsFilters} from '~/entities/filters/proposals-filters';
import {
  $streamProposalLoading,
  $streamProposalSortOrder,
  $streamSelectedProposalStatus,
  $streamSelectedProposalVariant,
  changeStreamProposalSelectedStatus,
  changeStreamProposalSelectedVariant,
  changeStreamProposalSortOrder,
} from '~/entities/streams/model';
import {sendTransactionsFx} from '~/entities/transactions';
import {ProposalVariantForStream} from '~/entities/treasury/model/constants';
import {Row} from 'ui/components/row';
import {Typography} from 'ui/components/typography';

import {ProposalsList} from './proposals-list';

export const StreamProposals = () => {
  const streamSelectedProposalStatus = useStore($streamSelectedProposalStatus);
  const streamSelectedProposalVariant = useStore($streamSelectedProposalVariant);
  const isLoading = useStore($streamProposalLoading);
  const streamProposalSortOrder = useStore($streamProposalSortOrder);

  React.useEffect(() => {
    sendTransactionsFx();
  }, []);

  const isDefaultFiltersValue =
    streamSelectedProposalVariant === 'Any' && streamSelectedProposalStatus === 'all';

  return (
    <>
      <Row align='center' justify='between'>
        <Typography as='span' font='heading'>
          Stream proposals
        </Typography>
      </Row>
      <ProposalsFilters
        variantOptions={ProposalVariantForStream}
        isLoading={isLoading}
        selectedProposalStatus={streamSelectedProposalStatus}
        selectedProposalVariant={streamSelectedProposalVariant}
        proposalSortOrder={streamProposalSortOrder}
        handleChangeProposalStatus={changeStreamProposalSelectedStatus}
        handleChangeProposalVariant={changeStreamProposalSelectedVariant}
        handleChangeProposalSortOrder={changeStreamProposalSortOrder}
      />
      <ProposalsList isDefaultFiltersValue={isDefaultFiltersValue} />
    </>
  );
};
