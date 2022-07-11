import React from 'react';

import {ProposalsList} from '~/features/treasury/ui/proposals-list';
import {Chip} from '~/shared/ui/components/chip/Chip';
import {Typography} from '~/shared/ui/components/typography';

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

    <ProposalsList />
  </>
);
