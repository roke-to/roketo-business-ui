import React, {useState} from 'react';

import {ProposalKindSwaggerDto} from '~/shared/api/astro';
import {DropDownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropDownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropDownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
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
      <DropDownMenu label='Any' contentRef={contentRef} variant='soft'>
        <DropDownContent
          ref={contentRef}
          selected={selected}
          handleChange={handleChange}
          offset='m'
        >
          {ProposalKind.map((kind) => (
            <DropDownItem key={kind}>{kind}</DropDownItem>
          ))}
        </DropDownContent>
      </DropDownMenu>
    </>
  );
};
