import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {
  $treasurySelectedProposalKind,
  changeTreasuryProposalSelectedKind,
  ProposalKindFilterType,
} from '~/entities/treasury';
import {DropdownMenu} from '~/shared/ui/components/dropdown-menu';
import {DropdownContent} from '~/shared/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '~/shared/ui/components/dropdown-menu/dropdown-item';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

const ProposalKind: ProposalKindFilterType[] = [
  'Any',
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
  const {t} = useTranslation('treasury');

  const treasurySelectedProposalKind = useStore($treasurySelectedProposalKind);

  const selected = ProposalKind.findIndex((kind) => kind === treasurySelectedProposalKind);

  const handleChange = (index: number) => {
    changeTreasuryProposalSelectedKind(ProposalKind[index]);
  };

  return (
    <Row align='center' gap='sm'>
      <Typography as='span' color='muted'>
        {t('type')}:
      </Typography>
      <DropdownMenu label={treasurySelectedProposalKind} contentRef={contentRef} variant='soft'>
        <DropdownContent
          ref={contentRef}
          selected={selected}
          handleChange={handleChange}
          offset='m'
          gap={3}
        >
          {ProposalKind.map((kind) => (
            <DropdownItem key={kind}>{kind}</DropdownItem>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Row>
  );
};
