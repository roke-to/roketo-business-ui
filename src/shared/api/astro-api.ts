import axios from 'axios';

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
  threshold?: number[];
  weight?: string;
};

export type TGroup = {
  members: string[];
  name: string;
  permissions: string[];
  votePolicy: Record<string, DaoVotePolicy>;
  slug: string;
};

export type DaoVersion = {
  createdAt: string;
  hash: string;
  version: number[];
  commitId: string;
  changelogUrl: string;
};

type DaoProperties = {
  id: string;
  name: string;
  description: string;
  flagCover?: string;
  flagLogo?: string;
  links: string[];
  displayName: string;
  legal?: {
    legalStatus?: string;
    legalLink?: string;
  };
};

export type DAO = {
  txHash: string;
  members: number;
  daoVersionHash: string;
  daoVersion: DaoVersion;
  daoMembersList: string[];
  funds: string;
  totalProposals: number;
  activeProposalsCount: number;
  totalProposalsCount: number;
  totalDaoFunds: number;
  createdAt: string;
  groups: TGroup[];
  policy: any;
  votes?: number;
  logo?: string;
  lastProposalId: number;
} & DaoProperties;

export type DAOPreview = {
  funds: string;
} & DaoProperties;

export type VotePolicyRequest = {
  // eslint-disable-next-line camelcase
  weight_kind: string;
  quorum: string;
  threshold: number[] | string;
};

export type RolesRequest = {
  name: string;
  kind: string | {Group: string[]};
  permissions: string[];
  // eslint-disable-next-line camelcase
  vote_policy: Record<string, VotePolicyRequest>;
};

export type PolicyTypeRequest = {
  roles: RolesRequest[];
  defaultVotePolicy: VotePolicyRequest;
  proposalBond: string;
  proposalPeriod: string;
  bountyBond: string;
  bountyForgivenessPeriod: string;
};

export interface CreateDaoInput {
  name: string;
  purpose: string;
  bond: string;
  votePeriod: string;
  gracePeriod: string;
  links: [];
  flagCover: string;
  flagLogo: string;
  amountToTransfer: string;
  displayName: string;
  policy: PolicyTypeRequest;
  legal?: {
    legalStatus?: string;
    legalLink?: string;
  };
  gas: string | number;
}

export interface CreateDaoCustomInput {
  name: string;
  amountToTransfer: string;
  gas: string | number;
  args: string;
}

export type DaoSubscription = {
  id: string;
  dao: DAO;
};

export type DaoSubscriptionInput = {
  accountId: string;
  publicKey: string;
  signature: string;
};

export type UpdateDaoSubscription = {
  daoId: string;
} & DaoSubscriptionInput;

export type DaoFeedItem = {
  createdAt: string;
  numberOfMembers: number;
  numberOfGroups: number;
  accountIds: string[];
  activeProposalCount: number;
  totalProposalCount: number;
  totalDaoFunds: number;
  txHash: string;
  logo?: string;
  policy: {
    daoId: string;
    roles: {
      name: string;
      accountIds: string[];
    }[];
  };
  council: string[];
  isCouncil: boolean;
} & DaoProperties;

// https://github.com/near-daos/astro-ui/blob/5b26bda2492e24ba6c101cb95e221208a433fea9/services/sputnik/SputnikHttpService/SputnikHttpService.ts
export async function getAccountDaos(accountId: string): Promise<DaoFeedItem[]> {
  try {
    console.log('accountId', accountId);

    const {data} = await axios.get<DaoFeedItem[]>(
      `https://api.dev.app.astrodao.com/api/v1/daos/account-daos/${accountId}`,
      {
        params: {
          responseMapper: {
            name: 'mapDaoFeedItemResponseToDaoFeed',
          },
        },
      },
    );

    console.log('data', data);

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
}
