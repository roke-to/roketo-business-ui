import * as nearApi from 'near-api-js';
import {createForm} from 'effector-forms';
import {t} from 'i18next';
import {Get} from 'type-fest';

import {isAccountExistFx} from '~/entities/account-exist-effect';
import {sendTransactionsFx} from '~/entities/transactions';
import {astroApi, Proposal, Token} from '~/shared/api/astro';
import {
  ATTACHED_DEPOSIT,
  DEFAULT_FUNCTION_CALL_GAS_BN,
} from '~/shared/api/near/contracts/contract.constants';
import {mapFunctionCallOptions} from '~/shared/api/near/contracts/sputnik-dao/map-function-call-options';
import {mapTransferOptions} from '~/shared/api/near/contracts/sputnik-dao/map-transfer-options';
import {addKindProposalQuery} from '~/shared/lib/requestQueryBuilder/add-kind-proposal-query';
import {addStatusProposalQuery} from '~/shared/lib/requestQueryBuilder/add-status-proposal-query';
import {ProposalKindFilterType} from '~/shared/types/proposal-kind-filter-type';
import {ProposalSortOrderType} from '~/shared/types/proposal-sort-order-type';
import {ProposalStatusFilterType} from '~/shared/types/proposal-status-filter-type';

import {SignAndSendTransactionsParams} from '@near-wallet-selector/core/lib/wallet';
import {attach, createEvent, createStore, forward, sample} from '@roketo/core/lib/effector';
import {ValuesOfForm} from '@roketo/core/lib/form';
import {validators} from '@roketo/core/lib/form/validators';

import {
  $accountId,
  $accountStreams,
  $currentDaoId,
  $near,
  $roketoWallet,
  $tokens,
  $walletSelector,
  requestUnknownTokensFx,
} from '../../wallet';

// ------------ proposals ------------

export const $treasuryProposals = createStore<Proposal[]>([]);

export const $treasuryProposalLoading = createStore(true);

// /------------ proposals ------------

//  ------------ proposals filter by status ------------

export const changeTreasuryProposalSelectedStatus = createEvent<ProposalStatusFilterType>();

export const $treasurySelectedProposalStatus = createStore<ProposalStatusFilterType>('all').on(
  changeTreasuryProposalSelectedStatus,
  (_, status) => status,
);

//  /------------ proposals filter by status ------------

//  ------------ proposals filter by kind ------------
export const changeTreasuryProposalSelectedKind = createEvent<ProposalKindFilterType>();

export const $treasurySelectedProposalKind = createStore<ProposalKindFilterType>('Any').on(
  changeTreasuryProposalSelectedKind,
  (_, proposalKind) => proposalKind,
);
//  /------------ proposals filter by kind ------------

//  ------------ proposals sort by createAt  ------------
export const changeTreasuryProposalSortOrder = createEvent<ProposalSortOrderType>();

export const $treasuryProposalSortOrder = createStore<ProposalSortOrderType>('DESC').on(
  changeTreasuryProposalSortOrder,
  (_, sortType) => sortType,
);
//  /------------ proposals sort by createAt ------------

const loadTreasuryProposalsFx = attach({
  source: {
    daoId: $currentDaoId,
    accountId: $accountId,
    status: $treasurySelectedProposalStatus,
    kind: $treasurySelectedProposalKind,
    sort: $treasuryProposalSortOrder,
  },
  async effect({daoId, accountId, status, kind, sort}) {
    const defaultKindFilterQuery = 'FunctionCall,Transfer';

    const query = {
      ...addStatusProposalQuery(status),
      limit: 20,
      offset: 0,
      accountId,
      dao: daoId,
      type: addKindProposalQuery(kind, defaultKindFilterQuery),
      orderBy: 'createdAt',
      order: sort,
    };

    return astroApi.proposalControllerProposals(query).then((response: {data: unknown}) => {
      const proposals = response.data as unknown as Proposal[];
      return proposals.filter(
        (p) =>
          !p.description.includes('ProposeCreateRoketoStream') &&
          !p.description.includes('ProposePauseRoketoStream') &&
          !p.description.includes('ProposeStartRoketoStream') &&
          !p.description.includes('ProposeStopRoketoStream') &&
          !p.description.includes('ProposeAddFundsToRoketoStream') &&
          !p.description.includes('ProposeRoketoStreamWithdraw'),
      );
    });
  },
});

sample({
  source: sendTransactionsFx.doneData,
  target: loadTreasuryProposalsFx,
});
sample({
  clock: $currentDaoId,
  target: loadTreasuryProposalsFx,
});

sample({
  source: loadTreasuryProposalsFx.doneData,
  target: $treasuryProposals,
});

sample({
  clock: changeTreasuryProposalSelectedStatus,
  target: loadTreasuryProposalsFx,
});

sample({
  clock: changeTreasuryProposalSelectedKind,
  target: loadTreasuryProposalsFx,
});

sample({
  clock: changeTreasuryProposalSortOrder,
  target: loadTreasuryProposalsFx,
});
sample({
  clock: loadTreasuryProposalsFx.finally,
  fn: () => false,
  target: $treasuryProposalLoading,
});
sample({
  clock: loadTreasuryProposalsFx,
  fn: () => true,
  target: $treasuryProposalLoading,
});

// ------------- tokens --------------

export const $tokenBalances = createStore<Array<Token>>([]);
export const $tokensNonZeroBalance = $tokenBalances.map((tokenBalances) =>
  tokenBalances.reduce((prev, token) => {
    if (parseInt(token.balance, 10) > 0) {
      return [
        ...prev,
        {
          value: token.id,
          label: token.symbol,
        },
      ];
    }
    return prev;
  }, [] as {value: string; label: string}[]),
);

export const loadTokenBalances = createEvent();

const loadTokenBalancesFx = attach({
  source: {
    daoId: $currentDaoId,
  },
  async effect({daoId}) {
    // TODO: remove after PR https://github.com/near-daos/astro-api-gateway/pull/386 merged
    // and astro-api regenerated
    return astroApi.tokenControllerTokensByDao(daoId) as unknown as Promise<Array<Token>>;
  },
});

sample({
  source: loadTokenBalances,
  target: loadTokenBalancesFx,
});
sample({
  clock: $currentDaoId,
  target: loadTokenBalancesFx,
});

sample({
  source: loadTokenBalancesFx.doneData,
  target: $tokenBalances,
});

sample({
  clock: $accountStreams,
  source: {
    tokens: $tokens,
    roketo: $roketoWallet,
    near: $near,
    currentDaoId: $currentDaoId,
    tokenBalances: $tokenBalances,
  },
  target: requestUnknownTokensFx,
  fn({tokens, roketo, near, currentDaoId, tokenBalances}, streams) {
    const allStreams = [...streams.inputs, ...streams.outputs];
    const otherTokens = tokenBalances.map(({id}) => id);
    const streamsTokens = [
      ...new Set(allStreams.map((stream) => stream.token_account_id).concat(otherTokens)),
    ];
    const unknownTokens = streamsTokens.filter((token) => !(token in tokens));
    return {
      tokenNames: unknownTokens,
      roketo,
      nearAuth: near
        ? {
            balance: near.balance,
            account: near.account,
            signedIn: !!near.accountId,
            accountId: near.accountId,
            login: near.login,
            logout: near.logout,
            transactionMediator: near.transactionMediator,
          }
        : null,
      currentDaoId,
    };
  },
});

//  ------------ proposals create  ------------

export const createTreasuryProposalForm = createForm({
  fields: {
    type: {
      init: 'transfer',
      rules: [validators.required({if: (form) => form.type === 'transfer'})],
    },
    targetAccountId: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'transfer'})],
    },
    amount: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'transfer'})],
    },
    token: {
      init: 'NEAR',
      rules: [validators.required()],
    },
    contractAddress: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'functionCall'})],
    },
    contractMethod: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'functionCall'})],
    },
    json: {
      init: '',
      rules: [validators.required({if: (form) => form.type === 'functionCall'})],
    },
    deposit: {
      init: '0',
    },
    description: {
      init: '',
    },
    link: {
      init: '',
    },
    tgas: {
      init: '150',
      rules: [validators.required()],
    },
    callbackUrl: {
      init: '',
    },
  },
  validateOn: ['submit'],
});

export const createTreasuryProposalFx = attach({
  source: {
    currentDaoId: $currentDaoId,
    walletSelector: $walletSelector,
    tokenBalances: $tokenBalances,
  },
  async effect(
    {currentDaoId, walletSelector, tokenBalances},
    data: ValuesOfForm<typeof createTreasuryProposalForm>,
  ) {
    if (!walletSelector) {
      throw new Error('walletSelector is not initialized');
    }

    const token = tokenBalances.find((tokenBalance) => tokenBalance.id === data.token);

    if (!token) {
      throw new Error(`Token ${data.token} not found`);
    }

    const wallet = await walletSelector.wallet();

    // collect transactions for safe transfer
    // https://github.com/near-daos/astro-ui/blob/368a710439c907ff5295625e98e87b5685319df3/services/sputnik/SputnikNearService/services/NearService.ts#L481
    const transactions: Get<SignAndSendTransactionsParams, 'transactions'> = [];

    switch (data.type) {
      case 'transfer': {
        // reserve storage in contract of token
        if (token.id !== 'NEAR') {
          transactions.push({
            receiverId: token.id,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'storage_deposit',
                  args: {
                    account_id: data.targetAccountId,
                    registration_only: true,
                  },
                  gas: DEFAULT_FUNCTION_CALL_GAS_BN.toString(),
                  // minimal deposit is 0.1 NEAR
                  deposit: nearApi.utils.format.parseNearAmount(ATTACHED_DEPOSIT)!,
                },
              },
            ],
          });
        }

        transactions.push({
          receiverId: currentDaoId,
          actions: [
            {
              type: 'FunctionCall',
              params: mapTransferOptions({
                description: data.description,
                token: token.id === 'NEAR' ? '' : token.id,
                amount: data.amount,
                tokenDecimals: token.decimals,
                targetAccountId: data.targetAccountId,
                link: data.link,
              }),
            },
          ],
        });

        return wallet.signAndSendTransactions({
          transactions,
          callbackUrl: data.callbackUrl,
        });
      }
      case 'functionCall':
        transactions.push({
          receiverId: currentDaoId,
          actions: [
            {
              type: 'FunctionCall',
              params: mapFunctionCallOptions({
                description: data.description,
                deposit: data.deposit,
                contractAddress: data.contractAddress,
                contractMethod: data.contractMethod,
                json: data.json,
                link: data.link,
              }),
            },
          ],
        });

        return wallet.signAndSendTransactions({
          transactions,
          callbackUrl: data.callbackUrl,
        });
      default:
        throw Error(`We don't recognize action for ${data.type}`);
    }
  },
});

forward({
  from: createTreasuryProposalForm.formValidated,
  to: createTreasuryProposalFx,
});

forward({
  from: createTreasuryProposalForm.fields.targetAccountId.$value,
  to: isAccountExistFx,
});

sample({
  clock: isAccountExistFx.doneData,
  source: {
    errors: createTreasuryProposalForm.fields.targetAccountId.$errors,
    targetAccountId: createTreasuryProposalForm.fields.targetAccountId.$value,
  },
  fn({targetAccountId, errors}, isTargetAccountIdExists) {
    if (!isTargetAccountIdExists && Boolean(targetAccountId)) {
      return [
        ...errors,
        {
          rule: 'accountIdExist',
          value: targetAccountId,
          errorText: t('proposal:createForm.accountNotExists'),
        },
      ];
    }
    return errors;
  },
  target: createTreasuryProposalForm.fields.targetAccountId.$errors,
});
