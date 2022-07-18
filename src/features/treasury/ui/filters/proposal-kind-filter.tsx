import React, {useState} from 'react';

import {ProposalKindSwaggerDto} from '~/shared/api/astro';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Typography} from '~/shared/ui/components/typography';

const ProposalKind: Pick<ProposalKindSwaggerDto, 'type'>['type'][] = [
  'ChangeConfig',
  'ChangePolicy',
  'AddMemberToRole',
  'RemoveMemberFromRole',
  'FunctionCall',
  'UpgradeSelf',
  'UpgradeRemote',
  'Transfer',
  'SetStakingContract',
  'AddBounty',
  'BountyDone',
  'Vote',
];

const contentRef = React.createRef<HTMLUListElement>();

export const ProposalKindFilter = () => {
  const [selected, setSelected] = useState(2);

  const handleChange = (n: number) => {
    console.log('PROPOSAL KIND ->', ProposalKind[n]);
    setSelected(n);
  };

  return (
    <>
      <Typography as='span' color='muted'>
        Type:
      </Typography>
      <DropdownMenu label='Any' contentRef={contentRef} variant='soft'>
        <DropdownContent
          ref={contentRef}
          selected={selected}
          handleChange={handleChange}
          offset='m'
        >
          {ProposalKind.map((kind) => (
            <DropdownItem key={kind}>{kind}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </>
  );
};
