import axios, {
  AxiosDefaults,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DaoConfig {
  name: string;
  purpose: string;
  metadata: string;
}

export interface VotePolicy {
  weightKind: 'TokenWeight' | 'RoleWeight';
  quorum: number;
  kind: 'Weight' | 'Ratio';
  weight: number;
  ratio: string[];
}

export interface Role {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  name: string;
  kind: string;
  balance: number;
  accountIds: string[];
  permissions: string[];
  votePolicy: Record<string, VotePolicy>;
}

export interface Policy {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  daoId: string;
  proposalBond: string;
  bountyBond: string;
  proposalPeriod: number;
  bountyForgivenessPeriod: number;
  defaultVotePolicy: VotePolicy;
  roles: Role[];
}

export interface DaoVersion {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  hash: string;
  version: string[];
  commitId: string;
  changelogUrl: string;
}

export interface Dao {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  config: DaoConfig;
  metadata: object;
  amount: number;
  totalSupply: string;
  lastBountyId: number;
  lastProposalId: number;
  stakingContract: string;

  /** How many accounts in total have interacted with the DAO (made proposals, voted, etc). */
  numberOfAssociates: number;

  /** How many accounts are members of the DAO */
  numberOfMembers: number;

  /** How many groups exist in the DAO */
  numberOfGroups: number;

  /** List of accounts that can vote for various activity */
  council: string[];

  /** List of all account ids that joined the DAO */
  accountIds: string[];

  /** Council accounts count */
  councilSeats: number;
  policy: Policy;
  createdBy: string;
  daoVersionHash: string;
  daoVersion: DaoVersion;
  status: object;
  activeProposalCount: number;
  totalProposalCount: number;
  totalDaoFunds: number;
}

export interface RoleKindDto {
  group: string[];
}

export interface RoleDto {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  name: string;
  kind: RoleKindDto;
  balance: number;
  accountIds: string[];
  permissions: string[];
  votePolicy: object;
}

export interface PolicyDto {
  proposalBond: string;
  bountyBond: string;
  proposalPeriod: number;
  bountyForgivenessPeriod: number;
  defaultVotePolicy: VotePolicy;
  roles: RoleDto;
}

export interface ActionCall {
  methodName: number;
  args: string;
  deposit: string;
  gas: string;
}

export interface ProposalKindSwaggerDto {
  type:
    | 'ChangeConfig'
    | 'ChangePolicy'
    | 'AddMemberToRole'
    | 'RemoveMemberFromRole'
    | 'FunctionCall'
    | 'UpgradeSelf'
    | 'UpgradeRemote'
    | 'Transfer'
    | 'SetStakingContract'
    | 'AddBounty'
    | 'BountyDone'
    | 'Vote';

  /**
   * DaoConfig
   * For type: ChangeConfig
   */
  config: DaoConfig;
  policy: PolicyDto;

  /** For type: AddMemberToRole or RemoveMemberFromRole */
  memberId: string;

  /** For type: AddMemberToRole or RemoveMemberFromRole */
  role: string;

  /** For type: FunctionCall or UpgradeRemoteor Transferor BountyDone */
  receiverId: string;

  /** For type: FunctionCall */
  actions: ActionCall[];

  /** For type: UpgradeSelfor UpgradeRemote */
  hash: string;

  /** For type: UpgradeRemote */
  methodName: string;

  /** For type: Transfer */
  tokenId: string;

  /** For type: Transfer */
  msg: string;

  /** For type: SetStakingContract */
  stakingId: string;

  /** For type: AddBounty */
  bounty: Bounty;

  /** For type: BountyDone */
  bountyId: string;
}

export interface ProposalAction {
  id: string;
  proposalId: string;
  accountId: string;
  action: object;
  transactionHash: string;
  timestamp: number;
}

export interface ProposalPermissions {
  canApprove: boolean;
  canReject: boolean;
  canDelete: boolean;
  isCouncil: boolean;
}

export interface Proposal {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  proposalId: number;
  daoId: string;
  dao: Dao;
  proposer: string;
  description: string;
  status: 'InProgress' | 'Approved' | 'Rejected' | 'Removed' | 'Expired' | 'Moved' | 'Failed';
  voteStatus: 'Active' | 'Expired';
  kind: ProposalKindSwaggerDto;
  submissionTime: number;
  voteCounts: object;
  votes: object;
  failure: object;
  actions: ProposalAction[];
  votePeriodEnd: number;
  bountyDoneId: string;
  bountyClaimId: string;
  permissions: ProposalPermissions;
}

export interface BountyContext {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  daoId: string;
  proposal: Proposal;
  bounty: Bounty;
  commentsCount: number;
}

export interface BountyClaim {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  accountId: string;
  startTime: string;
  deadline: string;
  completed: boolean;
  endTime: string;
}

export interface Bounty {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  bountyId: number;
  proposalId: string;
  daoId: string;
  dao: Dao;
  bountyContext: BountyContext;
  bountyDoneProposals: Proposal[];
  bountyClaims: BountyClaim[];
  description: string;
  token: string;
  amount: string;
  times: string;
  maxDeadline: string;
  numberOfClaims: number;
}

export interface BountyResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: Bounty[];
}

export interface BountyContextResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: BountyContext[];
}

export interface UpdateBountyContextDto {
  daoId: string;
  ids: string[];
  isArchived: boolean;
}

export interface DaoResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: Dao[];
}

export interface AccountDaoResponse {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  config: DaoConfig;
  metadata: object;
  amount: number;
  totalSupply: string;
  lastBountyId: number;
  lastProposalId: number;
  stakingContract: string;

  /** How many accounts in total have interacted with the DAO (made proposals, voted, etc). */
  numberOfAssociates: number;

  /** How many accounts are members of the DAO */
  numberOfMembers: number;

  /** How many groups exist in the DAO */
  numberOfGroups: number;

  /** List of accounts that can vote for various activity */
  council: string[];

  /** List of all account ids that joined the DAO */
  accountIds: string[];

  /** Council accounts count */
  councilSeats: number;
  policy: Policy;
  createdBy: string;
  daoVersionHash: string;
  daoVersion: DaoVersion;
  status: object;
  activeProposalCount: number;
  totalProposalCount: number;
  totalDaoFunds: number;
  isCouncil: boolean;
}

export interface DaoMemberVote {
  accountId: string;
  voteCount: number;
}

export type DaoSettingsDto = object;

export interface PatchSettingsBodyDto {
  settings: DaoSettingsDto;
}

export interface PatchSettingsParamBodyDto {
  value: object;
}

export interface ProposalTemplateConfigDto {
  smartContractAddress: string;
  methodName: string;
  deposit: string;
  actionsGas: string;
  json: string;
}

export interface ProposalTemplate {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  daoId: string;
  dao: Dao;
  name: string;
  isEnabled: boolean;
  config: ProposalTemplateConfigDto;
}

export interface ProposalTemplateBodyDto {
  name: string;
  description?: string;
  isEnabled: boolean;
  config: ProposalTemplateConfigDto;
}

export interface SharedProposalTemplateResponseDto {
  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  isArchived: boolean;
  name: string;
  description: string;
  createdBy: string;
  config: ProposalTemplateConfigDto;
  id: string;
  daos: string[];
  daoCount: number;
}

export interface SharedProposalTemplatesResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: SharedProposalTemplateResponseDto[];
}

export interface ProposalTemplateDto {
  daoId: string;
  name: string;
  isEnabled: boolean;
  config: ProposalTemplateConfigDto;
}

export interface ProposalResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: Proposal[];
}

export interface SearchMemberRoleDto {
  daoId: string;
  name: string;
  kind: 'Everyone' | 'Member' | 'Group';
  permissions: string;
}

export interface SearchMemberDto {
  accountId: string;
  roles: SearchMemberRoleDto[];
  voteCount: number;
}

export interface SearchMemberResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: SearchMemberDto[];
}

export interface SearchResultDto {
  daos: DaoResponse;
  proposals: ProposalResponse;
  members: SearchMemberResponse;
}

export interface SubscriptionDto {
  daoId: string;
}

export interface Subscription {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  dao: Dao;
  accountId: string;
  daoId: string;
}

export interface TokenBalance {
  id: string;
  tokenId: string;
  accountId: string;
  balance: string;
}

export interface Token {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  ownerId: string;
  totalSupply: string;
  decimals: number;
  icon: string;
  name: string;
  reference: string;
  referenceHash: string;
  spec: string;
  symbol: string;
  price: string;
  tokenId: string;
  balance: string;
  balances: TokenBalance[];
}

export interface TokenResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: Token[];
}

export interface NFTContract {
  id: string;
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  baseUri: string;
  reference: string;
  referenceHash: string;
}

export interface NFTTokenMetadata {
  tokenId: string;
  copies: number;
  description: string;
  expiresAt: string;
  extra: string;
  issuedAt: string;
  media: string;
  mediaHash: string;
  reference: string;
  referenceHash: string;
  startsAt: string;
  title: string;
  updatedAt: string;
  approvedAccountIds: string[];
  token: object;
}

export interface NFTToken {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  ownerId: string;
  tokenId: string;
  accountId: string;
  minter: string;
  contractId: string;
  contract: NFTContract;
  metadata: NFTTokenMetadata;
}

export interface NFTTokenResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: NFTToken[];
}

export interface AssetsNftEvent {
  emittedForReceiptId: string;
  emittedAtBlockTimestamp: number;
  emittedInShardId: number;
  emittedIndexOfEventEntryInShard: number;
  emittedByContractAccountId: string;
  tokenId: string;
  eventKind: string;
  tokenOldOwnerAccountId: string;
  tokenNewOwnerAccountId: string;
  tokenAuthorizedAccountId: string;
  eventMemo: string;
}

export interface ReceiptAction {
  receiptId: string;
  indexInActionReceipt: number;
  receiptPredecessorAccountId: string;
  receiptReceiverAccountId: string;
  actionKind:
    | 'CreateAccount'
    | 'DeployContract'
    | 'FunctionCall'
    | 'Transfer'
    | 'Stake'
    | 'AddKey'
    | 'DeleteKey'
    | 'DeleteAccount';
  args: object;
}

export interface Receipt {
  receiptId: string;
  predecessorAccountId: string;
  receiverAccountId: string;
  originatedFromTransactionHash: string;
  includedInBlockTimestamp: number;
  receiptActions: ReceiptAction[];
}

export interface Notification {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  daoId: string;
  dao: Dao;
  targetId: string;
  signerId: string;
  type:
    | 'CustomDao'
    | 'ClubDao'
    | 'FoundationDao'
    | 'CorporationDao'
    | 'CooperativeDao'
    | 'AddMemberToRole'
    | 'RemoveMemberFromRole'
    | 'FunctionCall'
    | 'Transfer'
    | 'ChangePolicy'
    | 'ChangeConfig'
    | 'AddBounty'
    | 'BountyDone'
    | 'Vote';
  status:
    | 'Created'
    | 'Approved'
    | 'Rejected'
    | 'Removed'
    | 'VoteApprove'
    | 'VoteReject'
    | 'VoteRemove';
  metadata: object;
  timestamp: number;
}

export interface NotificationResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: Notification[];
}

export interface AccountNotification {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  notificationId: string;
  notification: Notification;
  accountId: string;
  isPhone: boolean;
  isEmail: boolean;
  isMuted: boolean;
  isRead: boolean;
}

export interface AccountNotificationResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: AccountNotification[];
}

export interface UpdateAccountNotificationDto {
  isMuted: boolean;
  isRead: boolean;
  isArchived: boolean;
}

export interface AccountNotificationSettings {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  accountId: string;
  daoId: string;
  types: string[];
  mutedUntilTimestamp: number;
  isAllMuted: boolean;
  enableSms: boolean;
  enableEmail: boolean;
}

export interface AccountNotificationSettingsResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: AccountNotificationSettings[];
}

export interface CreateAccountNotificationSettingsDto {
  daoId: string;
  types: string[];
  mutedUntilTimestamp: string;
  enableSms: boolean;
  enableEmail: boolean;
  isAllMuted: boolean;
}

export interface NotificationStatusResponse {
  accountId: string;
  unreadCount: number;
}

export interface CommentReport {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: string;
  commentId: number;
  accountId: string;
  reason: string;
}

export interface Comment {
  isArchived: boolean;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
  id: number;
  daoId: string;
  proposalId: string;
  contextId: string;
  contextType: object;
  reports: CommentReport[];
  accountId: string;
  message: string;
}

export interface CommentResponse {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: Comment[];
}

export interface CommentDto {
  contextId: string;
  contextType: object;
  message: string;
}

export interface CommentReportDto {
  commentId: number;
  reason: string;
}

export interface CommentDeleteDto {
  reason: string;
}

export interface StatsStateDto {
  value: number;
  growth: number;
}

export interface DaoStatsStateDto {
  daoId: string;
  timestamp: number;
  totalDaoFunds: StatsStateDto;
  transactionsCount: StatsStateDto;
  bountyCount: StatsStateDto;
  nftCount: StatsStateDto;
  activeProposalCount: StatsStateDto;
  totalProposalCount: StatsStateDto;
}

export interface StatsEntryDto {
  value: number;
  timestamp: number;
}

export interface ProposalStatsEntryDto {
  active: number;
  total: number;
  timestamp: number;
}

export interface AccountResponse {
  accountId: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  isPhoneVerified: boolean;
}

export interface AccountEmailDto {
  email: string;
}

export interface VerificationStatus {
  isVerified: boolean;
  isSend: boolean;
  createdAt: number;
  ttl: number;
}

export interface AccountVerificationDto {
  code: string;
}

export interface AccountPhoneDto {
  phoneNumber: string;
}

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({securityWorker, secure, format, ...axiosConfig}: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({...axiosConfig, baseURL: axiosConfig.baseURL || ''});
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosDefaults {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === 'object' && property !== null
          ? JSON.stringify(property)
          : `${property}`,
      );
      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = (format && this.format) || void 0;

    if (type === ContentType.FormData && typeof body === 'object') {
      requestParams.headers.common = {Accept: '*/*'};
      requestParams.headers.post = {};
      requestParams.headers.put = {};

      body = this.createFormData(body as Record<string, unknown>);
    }

    const method = (
      requestParams.method ||
      this.instance.defaults.method ||
      'get'
    ).toLowerCase() as keyof HeadersDefaults;

    const flattenHeaders = {
      ...requestParams.headers,
      ...requestParams.headers.common,
      ...(requestParams.headers[method] && requestParams.headers[method]),
    };

    const methods: (keyof HeadersDefaults)[] = [
      'common',
      'delete',
      'get',
      'head',
      'post',
      'put',
      'patch',
      'options',
      'purge',
      'link',
      'unlink',
    ];

    flattenHeaders &&
      methods.forEach(function cleanHeaderConfig(method) {
        delete flattenHeaders[method];
      });

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? {'Content-Type': type} : {}),
        ...((flattenHeaders as unknown as AxiosRequestConfig['headers']) || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Sputnik v2 API
 * @version 1.0
 * @contact
 *
 * Sputnik v2 API Backend Server
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Bounty
     * @name BountyControllerBounties
     * @request GET:/api/v1/bounties
     * @response `200` `BountyResponse` List of aggregated Sputnik DAO Bounties
     * @response `400` `void` Bad Request Response based on the query params set
     */
    bountyControllerBounties: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<BountyResponse, void>({
        path: `/api/v1/bounties`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bounty
     * @name BountyControllerBountyById
     * @request GET:/api/v1/bounties/{id}
     * @response `200` `Bounty` Sputnik DAO Bounty
     * @response `400` `void` Invalid Bounty ID
     */
    bountyControllerBountyById: (id: string, params: RequestParams = {}) =>
      this.request<Bounty, void>({
        path: `/api/v1/bounties/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bounty
     * @name BountyControllerBountyContexts
     * @request GET:/api/v1/bounty-contexts
     * @response `200` `BountyContextResponse` List of aggregated Sputnik DAO Bounties
     * @response `400` `void` Bad Request Response based on the query params set
     */
    bountyControllerBountyContexts: (
      query?: {
        accountId?: string;
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<BountyContextResponse, void>({
        path: `/api/v1/bounty-contexts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bounty
     * @name BountyControllerUpdateBountyContexts
     * @request PATCH:/api/v1/bounty-contexts
     * @secure
     * @response `200` `void` OK
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    bountyControllerUpdateBountyContexts: (
      data: UpdateBountyContextDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/bounty-contexts`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerDaos
     * @request GET:/api/v1/daos
     * @response `200` `DaoResponse` List of aggregated Sputnik DAOs
     * @response `400` `void` Bad Request Response based on the query params set
     */
    daoControllerDaos: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<DaoResponse, void>({
        path: `/api/v1/daos`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerDaosByAccountId
     * @request GET:/api/v1/daos/account-daos/{accountId}
     * @response `200` `(AccountDaoResponse)[]` List of Sputnik DAOs by Account
     * @response `400` `void` Invalid Dao ID
     * @response `404` `void` Account does not exist
     */
    daoControllerDaosByAccountId: (accountId: string, params: RequestParams = {}) =>
      this.request<AccountDaoResponse[], void>({
        path: `/api/v1/daos/account-daos/${accountId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerDaoById
     * @request GET:/api/v1/daos/{id}
     * @response `200` `Dao` Sputnik DAO
     * @response `400` `void` Invalid Dao ID
     */
    daoControllerDaoById: (id: string, params: RequestParams = {}) =>
      this.request<Dao, void>({
        path: `/api/v1/daos/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoControllerDaoMembers
     * @request GET:/api/v1/daos/{id}/members
     * @response `200` `(DaoMemberVote)[]` DAO Members
     * @response `400` `void` Invalid Dao ID
     */
    daoControllerDaoMembers: (id: string, params: RequestParams = {}) =>
      this.request<DaoMemberVote[], void>({
        path: `/api/v1/daos/${id}/members`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoSettingsControllerGetSettings
     * @request GET:/api/v1/daos/{daoId}/settings
     * @response `200` `DaoSettingsDto` Get DAO settings
     */
    daoSettingsControllerGetSettings: (daoId: string, params: RequestParams = {}) =>
      this.request<DaoSettingsDto, any>({
        path: `/api/v1/daos/${daoId}/settings`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoSettingsControllerPatchSettings
     * @request PATCH:/api/v1/daos/{daoId}/settings
     * @secure
     * @response `200` `DaoSettingsDto` Save DAO settings
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    daoSettingsControllerPatchSettings: (
      daoId: string,
      data: PatchSettingsBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<DaoSettingsDto, void>({
        path: `/api/v1/daos/${daoId}/settings`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name DaoSettingsControllerPatchSettingsParam
     * @request PATCH:/api/v1/daos/{daoId}/settings/{key}
     * @secure
     * @response `200` `DaoSettingsDto` Save DAO settings param
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    daoSettingsControllerPatchSettingsParam: (
      daoId: string,
      key: string,
      data: PatchSettingsParamBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<DaoSettingsDto, void>({
        path: `/api/v1/daos/${daoId}/settings/${key}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name ProposalTemplateControllerGetDaoProposalTemplates
     * @request GET:/api/v1/daos/{daoId}/proposal-templates
     * @response `200` `(ProposalTemplate)[]` Get DAO proposal templates
     * @response `404` `void` DAO <daoId> does not exist
     */
    proposalTemplateControllerGetDaoProposalTemplates: (
      daoId: string,
      params: RequestParams = {},
    ) =>
      this.request<ProposalTemplate[], void>({
        path: `/api/v1/daos/${daoId}/proposal-templates`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name ProposalTemplateControllerCreateProposalTemplate
     * @request POST:/api/v1/daos/{daoId}/proposal-templates
     * @secure
     * @response `200` `ProposalTemplate` Create DAO proposal template
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` DAO <daoId> does not exist
     */
    proposalTemplateControllerCreateProposalTemplate: (
      daoId: string,
      data: ProposalTemplateBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<ProposalTemplate, void>({
        path: `/api/v1/daos/${daoId}/proposal-templates`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name ProposalTemplateControllerUpdateProposalTemplate
     * @request PATCH:/api/v1/daos/{daoId}/proposal-templates/{id}
     * @secure
     * @response `200` `ProposalTemplate` Create DAO proposal template
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` DAO <daoId> or proposal template <id> does not exist
     */
    proposalTemplateControllerUpdateProposalTemplate: (
      daoId: string,
      id: string,
      data: ProposalTemplateBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<ProposalTemplate, void>({
        path: `/api/v1/daos/${daoId}/proposal-templates/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags DAO
     * @name ProposalTemplateControllerDeleteProposalTemplate
     * @request DELETE:/api/v1/daos/{daoId}/proposal-templates/{id}
     * @secure
     * @response `200` `void` Proposal template deleted
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` DAO <daoId> or proposal template <id> does not exist
     */
    proposalTemplateControllerDeleteProposalTemplate: (
      daoId: string,
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/daos/${daoId}/proposal-templates/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Proposals
     * @name SharedProposalTemplateControllerSharedProposalTemplates
     * @request GET:/api/v1/proposals/templates
     * @response `200` `SharedProposalTemplatesResponse` List of Shared Proposal Templates
     * @response `400` `void` Bad Request Response based on the query params set
     */
    sharedProposalTemplateControllerSharedProposalTemplates: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
        join?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<SharedProposalTemplatesResponse, void>({
        path: `/api/v1/proposals/templates`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Proposals
     * @name SharedProposalTemplateControllerById
     * @request GET:/api/v1/proposals/templates/{id}
     * @response `200` `SharedProposalTemplateResponseDto` Shared Proposal Template
     * @response `400` `void` Invalid Shared Proposal Template ID
     */
    sharedProposalTemplateControllerById: (id: string, params: RequestParams = {}) =>
      this.request<SharedProposalTemplateResponseDto, void>({
        path: `/api/v1/proposals/templates/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Proposals
     * @name SharedProposalTemplateControllerCreateProposalTemplate
     * @request POST:/api/v1/proposals/templates/{id}/clone/{daoId}
     * @secure
     * @response `200` `ProposalTemplateDto` Clone Shared Proposal Template to DAO
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    sharedProposalTemplateControllerCreateProposalTemplate: (
      id: string,
      daoId: string,
      params: RequestParams = {},
    ) =>
      this.request<ProposalTemplateDto, void>({
        path: `/api/v1/proposals/templates/${id}/clone/${daoId}`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Proposals
     * @name ProposalControllerProposals
     * @request GET:/api/v1/proposals
     * @response `200` `ProposalResponse` List of aggregated Sputnik DAO Proposals
     * @response `400` `void` Bad Request Response based on the query params set
     */
    proposalControllerProposals: (
      query?: {
        sort?: string[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: string[];
        or?: string[];
        voted?: boolean;
        accountId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProposalResponse, void>({
        path: `/api/v1/proposals`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Proposals
     * @name ProposalControllerProposalById
     * @request GET:/api/v1/proposals/{id}
     * @response `200` `Proposal` Sputnik DAO Proposal
     * @response `400` `void` Invalid Proposal ID
     */
    proposalControllerProposalById: (
      id: string,
      query?: {accountId?: string},
      params: RequestParams = {},
    ) =>
      this.request<Proposal, void>({
        path: `/api/v1/proposals/${id}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Proposals
     * @name ProposalControllerProposalByAccount
     * @request GET:/api/v1/proposals/account-proposals/{accountId}
     * @response `200` `ProposalResponse` List of Proposals by Account
     * @response `400` `void` Bad Request Response based on the query params set
     * @response `404` `void` Account does not exist
     */
    proposalControllerProposalByAccount: (
      accountId: string,
      query?: {
        sort?: string[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: string[];
        or?: string[];
        voted?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProposalResponse, void>({
        path: `/api/v1/proposals/account-proposals/${accountId}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Search
     * @name SearchControllerSearch
     * @request GET:/api/v1/search
     * @response `200` `SearchResultDto` Search results: dao/proposals combined
     * @response `400` `void` query should not be empty
     */
    searchControllerSearch: (
      query: {
        sort?: string[];
        limit?: number;
        offset?: number;
        page?: number;
        query: string;
        accountId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SearchResultDto, void>({
        path: `/api/v1/search`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionsControllerCreate
     * @request POST:/api/v1/subscriptions
     * @secure
     * @response `201` `void` Created
     * @response `400` `void` No DAO '<addSubscriptionDto.daoId>' and/or Account '<addSubscriptionDto.accountId>' found.
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    subscriptionsControllerCreate: (data: SubscriptionDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/subscriptions`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionsControllerGetAccountSubscriptions
     * @request GET:/api/v1/subscriptions/account-subscriptions/{accountId}
     * @response `200` `Subscription` List of Subscriptions by Account
     * @response `404` `void` Account does not exist
     */
    subscriptionsControllerGetAccountSubscriptions: (
      accountId: string,
      params: RequestParams = {},
    ) =>
      this.request<Subscription, void>({
        path: `/api/v1/subscriptions/account-subscriptions/${accountId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionsControllerRemove
     * @request DELETE:/api/v1/subscriptions/{id}
     * @secure
     * @response `200` `void` OK
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` Subscription with id <id> not found
     */
    subscriptionsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/subscriptions/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Token
     * @name TokenControllerTokens
     * @request GET:/api/v1/tokens
     * @response `200` `TokenResponse` List of aggregated Fungible Tokens
     * @response `400` `void` Bad Request Response based on the query params set
     */
    tokenControllerTokens: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, void>({
        path: `/api/v1/tokens`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Token
     * @name TokenControllerTokensByDao
     * @request GET:/api/v1/tokens/account-tokens/{accountId}
     * @response `200` `Token` List of Fungible Tokens by Account
     * @response `404` `void` Account does not exist
     */
    tokenControllerTokensByDao: (accountId: string, params: RequestParams = {}) =>
      this.request<Token, void>({
        path: `/api/v1/tokens/account-tokens/${accountId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Token
     * @name TokenControllerNfts
     * @request GET:/api/v1/tokens/nfts
     * @response `200` `NFTTokenResponse` List of aggregated Non-Fungible Tokens
     * @response `400` `void` Bad Request Response based on the query params set
     */
    tokenControllerNfts: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<NFTTokenResponse, void>({
        path: `/api/v1/tokens/nfts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Token
     * @name TokenControllerNftEvents
     * @request GET:/api/v1/tokens/nfts/{id}/events
     * @response `200` `(AssetsNftEvent)[]` List of Non-Fungible Token Events
     * @response `404` `void` No NFT found
     */
    tokenControllerNftEvents: (id: string, params: RequestParams = {}) =>
      this.request<AssetsNftEvent[], void>({
        path: `/api/v1/tokens/nfts/${id}/events`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transactions
     * @name TransactionControllerReceiptsByAccount
     * @request GET:/api/v1/transactions/receipts/account-receipts/{accountId}
     * @response `200` `Receipt` List of Receipts by Account
     * @response `400` `void` Bad Request Response based on the query params set
     * @response `404` `void` Account does not exist
     */
    transactionControllerReceiptsByAccount: (accountId: string, params: RequestParams = {}) =>
      this.request<Receipt, void>({
        path: `/api/v1/transactions/receipts/account-receipts/${accountId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transactions
     * @name TransactionControllerReceiptsByAccountToken
     * @request GET:/api/v1/transactions/receipts/account-receipts/{accountId}/tokens/{tokenId}
     * @response `200` `Receipt` List of Receipts by Account and FT Token
     * @response `400` `void` Bad Request Response based on the query params set
     * @response `404` `void` Account does not exist
     */
    transactionControllerReceiptsByAccountToken: (
      tokenId: string,
      accountId: string,
      params: RequestParams = {},
    ) =>
      this.request<Receipt, void>({
        path: `/api/v1/transactions/receipts/account-receipts/${accountId}/tokens/${tokenId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transactions
     * @name TransactionControllerSuccess
     * @request GET:/api/v1/transactions/wallet/callback/{accountId}
     * @response `200` `void` OK
     * @response `404` `void` Account does not exist
     */
    transactionControllerSuccess: (
      accountId: string,
      query?: {
        transactionHashes?: string;
        redirectUrl?: string;
        errorCode?: string;
        errorMessage?: string;
        noRedirect?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/transactions/wallet/callback/${accountId}`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerGetNotifications
     * @request GET:/api/v1/notifications
     * @response `200` `NotificationResponse` List of Account Notifications
     * @response `400` `void` Bad Request Response based on the query params set
     */
    notificationControllerGetNotifications: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationResponse, void>({
        path: `/api/v1/notifications`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerGetNotificationById
     * @request GET:/api/v1/notifications/{id}
     * @response `200` `Notification` Notification
     * @response `400` `void` Invalid Notification ID
     */
    notificationControllerGetNotificationById: (id: string, params: RequestParams = {}) =>
      this.request<Notification, void>({
        path: `/api/v1/notifications/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerGetAccountNotifications
     * @request GET:/api/v1/account-notifications
     * @response `200` `AccountNotificationResponse` List of Account Notifications
     * @response `400` `void` Bad Request Response based on the query params set
     */
    notificationControllerGetAccountNotifications: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<AccountNotificationResponse, void>({
        path: `/api/v1/account-notifications`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerReadAccountNotifications
     * @request PATCH:/api/v1/account-notifications/read-all
     * @secure
     * @response `200` `void` OK
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    notificationControllerReadAccountNotifications: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/account-notifications/read-all`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerArchiveAccountNotifications
     * @request PATCH:/api/v1/account-notifications/archive-all
     * @secure
     * @response `200` `void` OK
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    notificationControllerArchiveAccountNotifications: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/account-notifications/archive-all`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerUpdateAccountNotification
     * @request PATCH:/api/v1/account-notifications/{id}
     * @secure
     * @response `200` `AccountNotification` OK
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` Account Notification with id <id> not found
     */
    notificationControllerUpdateAccountNotification: (
      id: string,
      data: UpdateAccountNotificationDto,
      params: RequestParams = {},
    ) =>
      this.request<AccountNotification, void>({
        path: `/api/v1/account-notifications/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerGetNotificationSettings
     * @request GET:/api/v1/notification-settings
     * @response `200` `AccountNotificationSettingsResponse` List of Account Notifications
     * @response `400` `void` Bad Request Response based on the query params set
     */
    notificationControllerGetNotificationSettings: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<AccountNotificationSettingsResponse, void>({
        path: `/api/v1/notification-settings`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerSetNotificationSettings
     * @request POST:/api/v1/notification-settings
     * @secure
     * @response `201` `AccountNotificationSettings` Created
     * @response `400` `void` Bad Request
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    notificationControllerSetNotificationSettings: (
      data: CreateAccountNotificationSettingsDto,
      params: RequestParams = {},
    ) =>
      this.request<AccountNotificationSettings, void>({
        path: `/api/v1/notification-settings`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationControllerGetAccountNotificationStatus
     * @request GET:/api/v1/account-notification-status/{accountId}
     * @response `200` `NotificationStatusResponse` Notification status by Account
     */
    notificationControllerGetAccountNotificationStatus: (
      accountId: string,
      params: RequestParams = {},
    ) =>
      this.request<NotificationStatusResponse, any>({
        path: `/api/v1/account-notification-status/${accountId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comments
     * @name CommentsControllerGetComments
     * @request GET:/api/v1/comments
     * @response `200` `CommentResponse` List of Comments
     */
    commentsControllerGetComments: (
      query?: {
        sort?: any[];
        limit?: number;
        offset?: number;
        page?: number;
        fields?: string;
        s?: string;
        filter?: any[];
        or?: any[];
      },
      params: RequestParams = {},
    ) =>
      this.request<CommentResponse, any>({
        path: `/api/v1/comments`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comments
     * @name CommentsControllerCreate
     * @request POST:/api/v1/comments
     * @secure
     * @response `201` `Comment` Created
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` No Proposal '<commentDto.proposalIs>' found.
     */
    commentsControllerCreate: (data: CommentDto, params: RequestParams = {}) =>
      this.request<Comment, void>({
        path: `/api/v1/comments`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comments
     * @name CommentsControllerCreateCommentReport
     * @request POST:/api/v1/comments/report
     * @secure
     * @response `201` `CommentReport` Created
     * @response `403` `void` Account <accountId> identity is invalid - public key  / Invalid signature
     */
    commentsControllerCreateCommentReport: (data: CommentReportDto, params: RequestParams = {}) =>
      this.request<CommentReport, void>({
        path: `/api/v1/comments/report`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comments
     * @name CommentsControllerDeleteComment
     * @request DELETE:/api/v1/comments/{id}
     * @secure
     * @response `200` `CommentReport` Deleted
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     * @response `404` `void` No Comment '<id>' found.
     */
    commentsControllerDeleteComment: (
      id: number,
      data: CommentDeleteDto,
      params: RequestParams = {},
    ) =>
      this.request<CommentReport, void>({
        path: `/api/v1/comments/${id}`,
        method: 'DELETE',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Aggregator
     * @name AggregatorControllerTriggerDaoAggregation
     * @request POST:/api/v1/aggregator/aggregate-dao/{id}
     * @secure
     * @response `201` `void` Aggregation Triggered
     */
    aggregatorControllerTriggerDaoAggregation: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/aggregator/aggregate-dao/${id}`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @name MetricsControllerMetrics
     * @request GET:/api/v1/metrics
     * @response `200` `void`
     */
    metricsControllerMetrics: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/metrics`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Stats
     * @name StatsControllerGetDaoStatsState
     * @request GET:/api/v1/stats/dao/{id}/state
     * @response `200` `DaoStatsStateDto` DAO Stats State
     * @response `404` `void` DAO <id> not found
     */
    statsControllerGetDaoStatsState: (id: string, params: RequestParams = {}) =>
      this.request<DaoStatsStateDto, void>({
        path: `/api/v1/stats/dao/${id}/state`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Stats
     * @name StatsControllerGetDaoStatsFunds
     * @request GET:/api/v1/stats/dao/{id}/funds
     * @response `200` `(StatsEntryDto)[]` List of DAO funds stats
     * @response `404` `void` DAO <id> not found
     */
    statsControllerGetDaoStatsFunds: (id: string, params: RequestParams = {}) =>
      this.request<StatsEntryDto[], void>({
        path: `/api/v1/stats/dao/${id}/funds`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Stats
     * @name StatsControllerGetDaoStatsBounties
     * @request GET:/api/v1/stats/dao/{id}/bounties
     * @response `200` `(StatsEntryDto)[]` List of DAO bounties count stats
     * @response `404` `void` DAO <id> not found
     */
    statsControllerGetDaoStatsBounties: (id: string, params: RequestParams = {}) =>
      this.request<StatsEntryDto[], void>({
        path: `/api/v1/stats/dao/${id}/bounties`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Stats
     * @name StatsControllerGetDaoStatsNfts
     * @request GET:/api/v1/stats/dao/{id}/nfts
     * @response `200` `(StatsEntryDto)[]` List of DAO NFTs count stats
     * @response `404` `void` DAO <id> not found
     */
    statsControllerGetDaoStatsNfts: (id: string, params: RequestParams = {}) =>
      this.request<StatsEntryDto[], void>({
        path: `/api/v1/stats/dao/${id}/nfts`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Stats
     * @name StatsControllerGetDaoStatsProposals
     * @request GET:/api/v1/stats/dao/{id}/proposals
     * @response `200` `(ProposalStatsEntryDto)[]` List of DAO proposals count stats
     * @response `404` `void` DAO <id> not found
     */
    statsControllerGetDaoStatsProposals: (id: string, params: RequestParams = {}) =>
      this.request<ProposalStatsEntryDto[], void>({
        path: `/api/v1/stats/dao/${id}/proposals`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerAccountById
     * @request GET:/api/v1/account/{accountId}
     * @response `200` `AccountResponse` Account
     * @response `404` `void` Account does not exist
     */
    accountControllerAccountById: (accountId: string, params: RequestParams = {}) =>
      this.request<AccountResponse, void>({
        path: `/api/v1/account/${accountId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerSetAccountEmail
     * @request POST:/api/v1/account/email
     * @secure
     * @response `201` `AccountResponse` Created
     * @response `400` `void` Invalid email provided
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    accountControllerSetAccountEmail: (data: AccountEmailDto, params: RequestParams = {}) =>
      this.request<AccountResponse, void>({
        path: `/api/v1/account/email`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerAccountEmailSendVerification
     * @request POST:/api/v1/account/email/send-verification
     * @secure
     * @response `201` `VerificationStatus` Email Verification Status
     * @response `400` `void` No email found for account / Email is already verified / Email verification already sent. Could be resend after 60 seconds
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    accountControllerAccountEmailSendVerification: (params: RequestParams = {}) =>
      this.request<VerificationStatus, void>({
        path: `/api/v1/account/email/send-verification`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerVerifyEmail
     * @request POST:/api/v1/account/email/verify
     * @secure
     * @response `201` `void` Verified
     * @response `400` `void` No email found for account / Invalid verification code
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    accountControllerVerifyEmail: (data: AccountVerificationDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/account/email/verify`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerAccountEmailStatus
     * @request GET:/api/v1/account/{accountId}/email/verification-status
     * @response `200` `VerificationStatus` Email Verification Status
     * @response `400` `void` No email found for account
     * @response `404` `void` Account does not exist
     */
    accountControllerAccountEmailStatus: (accountId: string, params: RequestParams = {}) =>
      this.request<VerificationStatus, void>({
        path: `/api/v1/account/${accountId}/email/verification-status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerSetAccountPhone
     * @request POST:/api/v1/account/phone
     * @secure
     * @response `201` `AccountResponse` Created
     * @response `400` `void` Invalid phone provided
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    accountControllerSetAccountPhone: (data: AccountPhoneDto, params: RequestParams = {}) =>
      this.request<AccountResponse, void>({
        path: `/api/v1/account/phone`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerAccountPhoneSendVerification
     * @request POST:/api/v1/account/phone/send-verification
     * @secure
     * @response `201` `VerificationStatus` Phone Verification Status
     * @response `400` `void` No phone number found for account / Phone is already verified / Phone verification already sent. Could be resend after 60 seconds
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    accountControllerAccountPhoneSendVerification: (params: RequestParams = {}) =>
      this.request<VerificationStatus, void>({
        path: `/api/v1/account/phone/send-verification`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerVerifyPhone
     * @request POST:/api/v1/account/phone/verify
     * @secure
     * @response `201` `void` Verified
     * @response `400` `void` No phone number found for account / Invalid verification code
     * @response `403` `void` Account <accountId> identity is invalid - public key / invalid signature / invalid accountId
     */
    accountControllerVerifyPhone: (data: AccountVerificationDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/account/phone/verify`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerAccountPhoneStatus
     * @request GET:/api/v1/account/{accountId}/phone/verification-status
     * @response `200` `VerificationStatus` Phone Verification Status
     * @response `400` `void` No phone number found for account
     * @response `404` `void` Account does not exist
     */
    accountControllerAccountPhoneStatus: (accountId: string, params: RequestParams = {}) =>
      this.request<VerificationStatus, void>({
        path: `/api/v1/account/${accountId}/phone/verification-status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
