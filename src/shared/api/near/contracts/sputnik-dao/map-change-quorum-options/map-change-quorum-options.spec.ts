import {Dao} from '~/shared/api/astro';

import {mapChangeQuorumOptions} from './map-change-quorum-options';

describe('Change quorum options', () => {
  test('return right options for success request', () => {
    const currentDao = {
      isArchived: false,
      createdAt: '2022-08-01T11:55:55.152Z',
      updatedAt: '2022-08-02T13:54:23.015Z',
      transactionHash: '9jrVnb7fkjKbpfbqoo5CQnsjKtfpKCKBCFyXf7kQtVTo',
      updateTransactionHash: 'AdPCsyST3UeVUgX9u22cmAWmaQe37JaLPF2fCdsabxEt',
      createTimestamp: '1659354949825227490',
      updateTimestamp: '1659440407587000000',
      id: 'barsik-test-dao.sputnikv2.testnet',
      config: {
        name: 'barsik-test-dao',
        purpose: '',
        metadata:
          'eyJsaW5rcyI6W10sImZsYWdDb3ZlciI6IiIsImZsYWdMb2dvIjoiIiwiZGlzcGxheU5hbWUiOiJiYXJzaWstdGVzdC1kYW8iLCJsZWdhbCI6eyJsZWdhbFN0YXR1cyI6IiIsImxlZ2FsTGluayI6IiJ9fQ==',
      },
      metadata: {
        legal: {legalLink: '', legalStatus: ''},
        links: [],
        flagLogo: '',
        flagCover: '',
        displayName: 'barsik-test-dao',
      },
      amount: '6000559293536705000000000',
      totalSupply: '0',
      lastBountyId: 0,
      lastProposalId: 2,
      stakingContract: '',
      numberOfAssociates: 0,
      numberOfMembers: 1,
      numberOfGroups: 1,
      council: ['barsik.testnet'],
      accountIds: ['barsik.testnet'],
      councilSeats: 1,
      link: '',
      description: '',
      createdBy: 'barsik.testnet',
      daoVersionHash: '783vth3Fg8MBBGGFmRqrytQCWBpYzUcmHoCq4Mo8QqF5',
      status: 'Active',
      activeProposalCount: 0,
      totalProposalCount: 3,
      totalDaoFunds: 25.740000000000002,
      policy: {
        isArchived: false,
        createdAt: '2022-08-01T11:55:55.152Z',
        updatedAt: '2022-08-01T11:55:55.152Z',
        daoId: 'barsik-test-dao.sputnikv2.testnet',
        proposalBond: '100000000000000000000000',
        bountyBond: '100000000000000000000000',
        proposalPeriod: '604800000000000',
        bountyForgivenessPeriod: '604800000000000',
        defaultVotePolicy: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 2]},
        roles: [
          {
            isArchived: false,
            createdAt: '2022-08-01T11:55:55.152Z',
            updatedAt: '2022-08-02T13:54:23.015Z',
            id: 'barsik-test-dao.sputnikv2.testnet-council',
            name: 'council',
            kind: 'Group',
            balance: null,
            accountIds: ['barsik.testnet'],
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
              remove_member_from_role: {
                weightKind: 'RoleWeight',
                quorum: '0',
                kind: 'Ratio',
                ratio: [1, 20],
              },
              upgrade_remote: {
                weightKind: 'RoleWeight',
                quorum: '0',
                kind: 'Ratio',
                ratio: [1, 20],
              },
              set_vote_token: {
                weightKind: 'RoleWeight',
                quorum: '0',
                kind: 'Ratio',
                ratio: [1, 20],
              },
              vote: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              bounty_done: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              transfer: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              upgrade_self: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              call: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              policy: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              add_member_to_role: {
                weightKind: 'RoleWeight',
                quorum: '0',
                kind: 'Ratio',
                ratio: [1, 20],
              },
              add_bounty: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
              config: {weightKind: 'RoleWeight', quorum: '0', kind: 'Ratio', ratio: [1, 20]},
            },
          },
          {
            isArchived: false,
            createdAt: '2022-08-01T11:55:55.152Z',
            updatedAt: '2022-08-02T13:54:23.015Z',
            id: 'barsik-test-dao.sputnikv2.testnet-all',
            name: 'all',
            kind: 'Everyone',
            balance: null,
            accountIds: null,
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
        ],
      },
      daoVersion: {
        isArchived: false,
        createdAt: '2022-05-18T15:01:39.700Z',
        updatedAt: '2022-05-18T15:01:39.700Z',
        hash: '783vth3Fg8MBBGGFmRqrytQCWBpYzUcmHoCq4Mo8QqF5',
        version: [3, 0],
        commitId: '640495ba572345ca356376989738fbd5462e1ff8',
        changelogUrl: null,
      },
    } as unknown as Dao;

    const formData = {
      type: 'changeQuorum',
      quorum: 10,
      councilAddress: '.near',
      councilList: ['barsik.testnet'],
      amount: '1',
      token: 'near',
      description: 'change 10$$$$$$$$ProposeUpdateGroup',
      link: '',
      tgas: '150',
    };
    expect(mapChangeQuorumOptions(currentDao, formData)).toMatchObject({
      type: 'FunctionCall',
      params: {
        methodName: 'add_proposal',
        args: {
          proposal: {
            description: 'change 10$$$$$$$$ProposeUpdateGroup$$$$',
            kind: {
              ChangePolicy: {
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
                      vote_policy: {},
                    },
                    {
                      name: 'council',
                      kind: {Group: ['barsik.testnet']},
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
                      vote_policy: {
                        add_member_to_role: {
                          quorum: '0',
                          threshold: [1, 10],
                          weight_kind: 'RoleWeight',
                        },
                        remove_member_from_role: {
                          quorum: '0',
                          threshold: [1, 10],
                          weight_kind: 'RoleWeight',
                        },
                        call: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        transfer: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        set_vote_token: {
                          quorum: '0',
                          threshold: [1, 10],
                          weight_kind: 'RoleWeight',
                        },
                        policy: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        config: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        upgrade_self: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        upgrade_remote: {
                          quorum: '0',
                          threshold: [1, 10],
                          weight_kind: 'RoleWeight',
                        },
                        add_bounty: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        bounty_done: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                        vote: {quorum: '0', threshold: [1, 10], weight_kind: 'RoleWeight'},
                      },
                    },
                  ],
                  default_vote_policy: {
                    quorum: '0',
                    threshold: [1, 2],
                    weight_kind: 'RoleWeight',
                  },
                  proposal_bond: '100000000000000000000000',
                  proposal_period: '604800000000000',
                  bounty_bond: '100000000000000000000000',
                  bounty_forgiveness_period: '604800000000000',
                },
              },
            },
          },
        },
        gas: '300000000000000',
        deposit: '100000000000000000000000',
      },
    });
  });
});
