import {Account, Contract, Near} from 'near-api-js';

import {FTContract} from '~/shared/api/types';

import type {
  ApiControl,
  RichToken,
  RoketoAccount,
  RoketoContract,
  RoketoDao,
  RoketoTokenMeta,
  TransactionMediator,
} from '@roketo/sdk/dist/types';

export async function initApiControl({
  near,
  accountId,
  transactionMediator,
  roketoContractName,
  wNearId,
}: {
  near: Near;
  accountId: string;
  transactionMediator: TransactionMediator;
  roketoContractName: string;
  wNearId: string;
}): Promise<ApiControl> {
  const account = await near.account(accountId);
  const contract = createRoketoContract({account, roketoContractName});
  const [roketoAccount, dao, state] = await Promise.all([
    getAccount({contract, accountId}),
    getDao({contract}),
    account.state(),
  ]);
  const richTokens = await createRichContracts({
    account,
    tokensInfo: Object.entries(dao.tokens),
    dao,
    accountId,
  });

  const nearAsToken = {
    ...richTokens[wNearId],
    meta: {
      ...richTokens[wNearId].meta,
      name: 'NEAR',
      symbol: 'NEAR',
    },
    roketoMeta: {
      ...richTokens[wNearId].roketoMeta,
      account_id: 'NEAR',
    },
    balance: state.amount,
  };

  return {
    account,
    accountId,
    contract,
    roketoAccount,
    dao,
    tokens: {
      ...richTokens,
      NEAR: nearAsToken,
    },
    transactionMediator,
  };
}

export async function createRichContracts({
  tokensInfo,
  account,
  dao,
  accountId,
}: {
  tokensInfo: Array<readonly [tokenAccountId: string, roketoMeta: RoketoTokenMeta]>;
  account: Account;
  dao: RoketoDao;
  accountId?: string;
}): Promise<{
  [tokenId: string]: RichToken;
}> {
  const currentAccountId = accountId || account.accountId;
  return Object.fromEntries(
    await Promise.all(
      tokensInfo.map(async ([tokenAccountId, roketoMeta]) => {
        const tokenContract = createTokenContract({account, tokenAccountId});
        const [meta, balance] = await Promise.all([
          getTokenMetadata({tokenContract}),
          getBalance({accountId: currentAccountId, tokenContract}),
        ]);

        // @ts-expect-error roketoMeta don't have is_payment
        const commission = roketoMeta.is_payment
          ? roketoMeta.commission_on_create
          : // @ts-expect-error dao don't have commission_non_payment_ft
            dao.commission_non_payment_ft;

        return [
          tokenAccountId,
          {
            roketoMeta,
            meta,
            balance,
            tokenContract,
            commission,
          },
        ];
      }),
    ),
  );
}

function createTokenContract({
  account,
  tokenAccountId,
}: {
  account: Account;
  tokenAccountId: string;
}) {
  return new Contract(account, tokenAccountId, {
    viewMethods: ['ft_balance_of', 'ft_metadata', 'storage_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit', 'near_deposit'],
  }) as FTContract;
}

function createRoketoContract({
  account,
  roketoContractName,
}: {
  account: Account;
  roketoContractName: string;
}) {
  return new Contract(account, roketoContractName, {
    viewMethods: [
      'get_stats',
      'get_dao',
      'get_token',
      'get_stream',
      'get_account',
      'get_account_incoming_streams',
      'get_account_outgoing_streams',
      'get_account_ft',
    ],
    changeMethods: ['start_stream', 'pause_stream', 'stop_stream', 'withdraw'],
  }) as RoketoContract;
}
async function getAccount({
  contract,
  accountId,
}: {
  contract: RoketoContract;
  accountId?: string | null | void;
}): Promise<RoketoAccount> {
  const emptyAccount = {
    active_incoming_streams: 0,
    active_outgoing_streams: 0,
    deposit: '0',
    inactive_incoming_streams: 0,
    inactive_outgoing_streams: 0,
    is_cron_allowed: true,
    last_created_stream: 'any',
    stake: '0',
    total_incoming: {},
    total_outgoing: {},
    total_received: {},
  };
  if (!accountId) return emptyAccount;
  return contract.get_account({account_id: accountId}).catch(() => emptyAccount);
}
export function getDao({contract}: {contract: RoketoContract}) {
  return contract.get_dao();
}

function getTokenMetadata({tokenContract}: {tokenContract: FTContract}) {
  return tokenContract.ft_metadata();
}

async function getBalance({
  accountId,
  tokenContract,
}: {
  accountId: string | null | void;
  tokenContract: FTContract;
}) {
  if (!accountId) return '0';
  return tokenContract.ft_balance_of({account_id: accountId});
}
