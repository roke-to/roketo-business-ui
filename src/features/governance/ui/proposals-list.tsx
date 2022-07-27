// import {useStore} from 'effector-react';
import React from 'react';

import {
  ProposalKindSwaggerDto as BaseProposalKindSwaggerDto,
  Proposal as ProposalType,
} from '~/shared/api/astro';
// import {$governanceProposals, loadGovernanceProposals} from '~/entities/governance';
import {Proposal} from '~/widgets/proposal';

interface ProposalKindSwaggerDto extends BaseProposalKindSwaggerDto {
  amount?: string;
}
interface ImprovedProposalType extends ProposalType {
  kind: ProposalKindSwaggerDto;
}

export const ProposalsList = () => {
  const governanceProposals = [
    {
      createdAt: '2022-07-27T13:18:34.921Z',
      updatedAt: '2022-07-27T13:21:03.204Z',
      transactionHash: 'FWvNVH4WWfzeyUso3bStUMFpgMdatTBcyNsKoULeGY4g',
      id: 'testdaoastro.sputnikv2.testnet-0',
      proposalId: 0,
      daoId: 'testdaoastro.sputnikv2.testnet',
      proposer: 'rkatarine.testnet',
      description: 'testtest$$$$$$$$ProposeUpdateGroup',
      status: 'InProgress',
      voteStatus: 'Active',
      kind: {
        type: 'ChangePolicy',
        policy: {
          roles: [
            {
              name: 'all',
              kind: 'Everyone',
              permissions: [
                'bounty_done:VoteApprove',
                'config:VoteRemove',
                'upgrade_self:VoteReject',
                'upgrade_remote:VoteReject',
                'set_vote_token:VoteApprove',
                'upgrade_remote:VoteRemove',
                'add_member_to_role:VoteRemove',
                'add_bounty:AddProposal',
                'set_vote_token:VoteReject',
                'vote:AddProposal',
                'policy:AddProposal',
                'bounty_done:VoteRemove',
                'remove_member_from_role:VoteReject',
                'transfer:VoteApprove',
                'add_member_to_role:VoteApprove',
                'remove_member_from_role:AddProposal',
                'bounty_done:AddProposal',
                'transfer:VoteReject',
                'add_member_to_role:AddProposal',
                'policy:VoteReject',
                'add_bounty:VoteReject',
                'policy:VoteApprove',
                'remove_member_from_role:VoteApprove',
                'call:VoteReject',
                'upgrade_remote:AddProposal',
                'upgrade_self:AddProposal',
                'upgrade_self:VoteApprove',
                'call:AddProposal',
                'config:VoteReject',
                'remove_member_from_role:VoteRemove',
                'transfer:AddProposal',
                'vote:VoteApprove',
                'call:VoteRemove',
                'config:AddProposal',
                'upgrade_self:VoteRemove',
                'vote:VoteReject',
                'policy:VoteRemove',
                'set_vote_token:VoteRemove',
                'add_bounty:VoteRemove',
                'bounty_done:VoteReject',
                'set_vote_token:AddProposal',
                'add_bounty:VoteApprove',
                'transfer:VoteRemove',
                'call:VoteApprove',
                'upgrade_remote:VoteApprove',
                'add_member_to_role:VoteReject',
                'config:VoteApprove',
                'vote:VoteRemove',
              ],
              votePolicy: {},
            },
            {
              name: 'council',
              kind: {group: ['rkatarine.testnet']},
              permissions: [
                'upgrade_self:AddProposal',
                'policy:VoteApprove',
                'policy:VoteRemove',
                'call:AddProposal',
                'config:VoteReject',
                'policy:AddProposal',
                'transfer:VoteRemove',
                'add_bounty:AddProposal',
                'config:AddProposal',
                'policy:VoteReject',
                'transfer:AddProposal',
                'add_bounty:VoteApprove',
                'add_bounty:VoteReject',
                'upgrade_self:VoteApprove',
                'upgrade_self:VoteReject',
                'bounty_done:VoteRemove',
                'set_vote_token:VoteApprove',
                'upgrade_remote:VoteApprove',
                'set_vote_token:AddProposal',
                '*:Finalize',
                'transfer:VoteApprove',
                'upgrade_remote:AddProposal',
                'add_member_to_role:VoteApprove',
                'remove_member_from_role:VoteRemove',
                'upgrade_remote:VoteReject',
                'call:VoteRemove',
                'add_bounty:VoteRemove',
                'add_member_to_role:VoteRemove',
                'add_member_to_role:VoteReject',
                'call:VoteReject',
                'set_vote_token:VoteReject',
                'vote:VoteApprove',
                'vote:VoteReject',
                'call:VoteApprove',
                'bounty_done:AddProposal',
                'remove_member_from_role:AddProposal',
                'transfer:VoteReject',
                'vote:AddProposal',
                'config:VoteApprove',
                'config:VoteRemove',
                'remove_member_from_role:VoteApprove',
                'bounty_done:VoteReject',
                'upgrade_self:VoteRemove',
                'add_member_to_role:AddProposal',
                'upgrade_remote:VoteRemove',
                'remove_member_from_role:VoteReject',
                'bounty_done:VoteApprove',
                'set_vote_token:VoteRemove',
                'vote:VoteRemove',
              ],
              votePolicy: {
                removeMemberFromRole: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                upgradeRemote: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                setVoteToken: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                vote: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                bountyDone: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                transfer: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                upgradeSelf: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                call: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                policy: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                addMemberToRole: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                addBounty: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
                config: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
              },
            },
          ],
          defaultVotePolicy: {weightKind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
          proposalBond: '100000000000000000000000',
          proposalPeriod: '604800000000000',
          bountyBond: '100000000000000000000000',
          bountyForgivenessPeriod: '604800000000000',
        },
      },
      type: 'ChangePolicy',
      votes: {'rkatarine.testnet': 'Approve'},
      votePeriodEnd: '1659442891541449000',
      dao: {
        transactionHash: '7cjaSMhU3hcCb6RBUG8xb7SHff8MzurVpu5kDxpJrWfZ',
        id: 'testdaoastro.sputnikv2.testnet',
        config: {
          name: 'testdaoastro',
          purpose: '',
          metadata:
            'eyJsaW5rcyI6W10sImZsYWdDb3ZlciI6IiIsImZsYWdMb2dvIjoiIiwiZGlzcGxheU5hbWUiOiJ0ZXN0ZGFvYXN0cm8iLCJsZWdhbCI6eyJsZWdhbFN0YXR1cyI6IiIsImxlZ2FsTGluayI6IiJ9fQ==',
        },
        numberOfMembers: 3,
        policy: {
          daoId: 'testdaoastro.sputnikv2.testnet',
          defaultVotePolicy: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 2]},
        },
      },
      actions: [
        {
          id: 'testdaoastro.sputnikv2.testnet-0-rkatarine.testnet-AddProposal',
          proposalId: 'testdaoastro.sputnikv2.testnet-0',
          accountId: 'rkatarine.testnet',
          action: 'AddProposal',
          transactionHash: 'FWvNVH4WWfzeyUso3bStUMFpgMdatTBcyNsKoULeGY4g',
          timestamp: '1658838091541449064',
        },
        {
          id: 'testdaoastro.sputnikv2.testnet-0-rkatarine.testnet-VoteApprove',
          proposalId: 'testdaoastro.sputnikv2.testnet-0',
          accountId: 'rkatarine.testnet',
          action: 'VoteApprove',
          transactionHash: '86UxADQcT8zh4JJ9HSdCrDUswj5VTPBB1A69ab4mDjs8',
          timestamp: '1658928052764000000',
        },
      ],
      commentsCount: 0,
      permissions: {
        isCouncil: true,
        canApprove: true,
        canReject: true,
        canDelete: true,
        canAdd: true,
      },
    },
  ] as unknown as ImprovedProposalType[];
  // const governanceProposals = useStore($governanceProposals);
  //
  // React.useEffect(() => {
  //   loadGovernanceProposals();
  // }, []);

  return (
    <>
      {governanceProposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );
};
