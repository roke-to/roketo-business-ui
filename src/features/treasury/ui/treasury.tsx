import React from 'react';

import {ProposalDateSort} from '~/features/treasury/ui/filters/proposal-date-sort';
import {ProposalKindFilter} from '~/features/treasury/ui/filters/proposal-kind-filter';
import {MockDaoList} from '~/features/treasury/ui/mock-dao-list';
import {ProposalsList} from '~/features/treasury/ui/proposals-list';
import {Chip} from '~/shared/ui/components/chip/Chip';
import {Typography} from '~/shared/ui/components/typography';

import {ProposalStatusFilter} from './filters/proposal-status-filter';

export const Treasury = () => (
  <>
    <div className='flex gap-2'>
      <Chip>
        <Typography as='span' weight='bold'>
          20 NEAR
        </Typography>
        <Typography as='span' weight='normal' color='muted'>
          970 USD
        </Typography>
      </Chip>
      <Chip>
        <Typography as='span' weight='bold'>
          12wNEAR
        </Typography>
        <Typography as='span' weight='normal' color='muted'>
          970 USD
        </Typography>
      </Chip>
      <Chip>
        <Typography as='span' weight='bold'>
          120 USN
        </Typography>
        <Typography as='span' weight='normal' color='muted'>
          970 USD
        </Typography>
      </Chip>
    </div>

    <div className='flex justify-between'>
      <ProposalStatusFilter />
      <div className='flex gap-2 items-center'>
        <ProposalKindFilter />
        <ProposalDateSort />
      </div>
    </div>

    <div className='flex gap-2 items-center'>
      <MockDaoList />
    </div>
    <ProposalsList />
  </>
);
