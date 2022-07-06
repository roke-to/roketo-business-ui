export const templateCreateArgs = ({
  name,
  displayName = name,
  accountId,
}: {
  name: string;
  accountId: string;
  displayName?: string;
}) =>
  btoa(
    JSON.stringify({
      purpose: '',
      bond: '100000000000000000000000',
      vote_period: '604800000000000',
      grace_period: '86400000000000',
      policy: {
        roles: [
          {
            name: 'council',
            slug: 'council',
            kind: {Group: [accountId]},
            permissions: [
              '*:Finalize',
              'policy:AddProposal',
              'add_bounty:AddProposal',
              'bounty_done:AddProposal',
              'transfer:AddProposal',
              'vote:AddProposal',
              'remove_member_from_role:AddProposal',
              'add_member_to_role:AddProposal',
              'config:AddProposal',
              'call:AddProposal',
              'upgrade_remote:AddProposal',
              'upgrade_self:AddProposal',
              'set_vote_token:AddProposal',
              'policy:VoteApprove',
              'policy:VoteReject',
              'policy:VoteRemove',
              'add_bounty:VoteApprove',
              'add_bounty:VoteReject',
              'add_bounty:VoteRemove',
              'bounty_done:VoteApprove',
              'bounty_done:VoteReject',
              'bounty_done:VoteRemove',
              'transfer:VoteApprove',
              'transfer:VoteReject',
              'transfer:VoteRemove',
              'vote:VoteApprove',
              'vote:VoteReject',
              'vote:VoteRemove',
              'remove_member_from_role:VoteApprove',
              'remove_member_from_role:VoteReject',
              'remove_member_from_role:VoteRemove',
              'add_member_to_role:VoteApprove',
              'add_member_to_role:VoteReject',
              'add_member_to_role:VoteRemove',
              'call:VoteApprove',
              'call:VoteReject',
              'call:VoteRemove',
              'config:VoteApprove',
              'config:VoteReject',
              'config:VoteRemove',
              'set_vote_token:VoteApprove',
              'set_vote_token:VoteReject',
              'set_vote_token:VoteRemove',
              'upgrade_self:VoteApprove',
              'upgrade_self:VoteReject',
              'upgrade_self:VoteRemove',
              'upgrade_remote:VoteApprove',
              'upgrade_remote:VoteReject',
              'upgrade_remote:VoteRemove',
            ],
            vote_policy: {},
          },
          {
            name: 'all',
            slug: 'all',
            kind: 'Everyone',
            permissions: [
              'policy:AddProposal',
              'add_bounty:AddProposal',
              'bounty_done:AddProposal',
              'transfer:AddProposal',
              'vote:AddProposal',
              'remove_member_from_role:AddProposal',
              'add_member_to_role:AddProposal',
              'config:AddProposal',
              'call:AddProposal',
              'upgrade_remote:AddProposal',
              'upgrade_self:AddProposal',
              'set_vote_token:AddProposal',
            ],
            vote_policy: {},
          },
        ],
        default_vote_policy: {weight_kind: 'RoleWeight', quorum: '0', threshold: [1, 2]},
        proposal_bond: '100000000000000000000000',
        proposal_period: '604800000000000',
        bounty_bond: '100000000000000000000000',
        bounty_forgiveness_period: '604800000000000',
      },
      config: {
        name,
        purpose: '',
        metadata: btoa(
          JSON.stringify({
            links: [],
            flagCover: '',
            flagLogo: '',
            displayName,
            legal: {legalStatus: '', legalLink: ''},
          }),
        ),
      },
    }),
  );
