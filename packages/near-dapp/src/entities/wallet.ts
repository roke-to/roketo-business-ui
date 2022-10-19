import {attach, createEffect, createEvent, createStore, sample} from 'effector';
import {Account, ConnectedWalletAccount, keyStores} from 'near-api-js';
import {Get} from 'type-fest';

import {filterRichTokensByBalance} from '~/entities/treasury/lib/filter-rich-tokens-by-balance';
import {
  createNearInstance,
  createWalletSelectorInstance,
  NearInstance,
  WalletId,
} from '~/shared/api/near';
import {initPriceOracle, PriceOracle} from '~/shared/api/price-oracle';
import {
  apiConfig,
  tokenProvider as roketoTokenProvider,
  usersApiClient as roketoUsersApiClient,
} from '~/shared/api/roketo-client';
import {env} from '~/shared/config/env';

import {ModuleState, WalletSelector, WalletSelectorState} from '@near-wallet-selector/core';
import {
  createRichContracts,
  getDao,
  getIncomingStreams,
  getOutgoingStreams,
  initApiControl,
} from '@roketo/sdk';
import type {
  ApiControl,
  NearAuth,
  RichToken,
  RoketoStream,
  TransactionMediator,
} from '@roketo/sdk/dist/types';

// createWalletSelectorInstance is async and it could be null until intialized
export const $walletSelector = createStore<WalletSelector | null>(null);
export const $walletSelectorState = createStore<WalletSelectorState>({
  contract: null,
  modules: [],
  accounts: [],
  selectedWalletId: null,
});
export const $near = createStore<NearInstance | null>(null);
export const $keyStore = createStore(new keyStores.BrowserLocalStorageKeyStore());

// Init empty walletSelector instance on app loaded
export const initWallet = createEvent();

const setWalletSelectorState = createEvent<WalletSelectorState>();

let walletSelectorStoreSubscription: ReturnType<Get<WalletSelector, 'store.observable.subscribe'>>;

const createWalletSelectorInstanceFx = createEffect(async () => {
  const walletSelector = await createWalletSelectorInstance();

  if (!walletSelectorStoreSubscription) {
    walletSelectorStoreSubscription = walletSelector.store.observable.subscribe((state) => {
      setWalletSelectorState(state);
    });
  }

  return walletSelector;
});

// Init empty wallet selector
sample({
  clock: initWallet,
  target: createWalletSelectorInstanceFx,
});
sample({
  clock: createWalletSelectorInstanceFx.doneData,
  target: $walletSelector,
});

// Update state when it changed
sample({
  clock: setWalletSelectorState,
  target: $walletSelectorState,
});

// Mapped stores shotcuts
export const $accountId = $walletSelectorState.map(({accounts}) => accounts[0]?.accountId ?? null);
export const $isSignedIn = $walletSelectorState.map(({accounts}) => Boolean(accounts.length));

// Login logic
export const walletClicked = createEvent<ModuleState>();

const loginViaWalletFx = createEffect(async (module: ModuleState) => {
  try {
    const wallet = await module.wallet();

    // dont support hardware wallet
    if (wallet.type === 'hardware') {
      return;
    }

    await wallet.signIn({
      contractId: env.ROKETO_CONTRACT_NAME,
    });
  } catch (err) {
    const {name} = module.metadata;

    const message = err instanceof Error ? err.message : 'Something went wrong';

    const error = new Error(`Failed to sign in with ${name}: ${message}`) as Error & {
      originalError: unknown;
    };

    error.originalError = err;

    throw error;
  }
});

export const initNearInstanceFx = attach({
  source: {
    walletSelectorState: $walletSelectorState,
    keyStore: $keyStore,
    walletSelector: $walletSelector,
  },
  async effect({walletSelectorState: {selectedWalletId}, keyStore, walletSelector}) {
    return createNearInstance(keyStore, walletSelector, selectedWalletId as WalletId);
  },
});

// Choose some wallet and click it
sample({
  clock: walletClicked,
  target: loginViaWalletFx,
});

// TODO: remove createNearInstance logic, when walletSelector expose account
// now this logic is necessary to get an account for the "Сontract"
sample({
  clock: createWalletSelectorInstanceFx.doneData,
  target: initNearInstanceFx,
});
sample({
  clock: initNearInstanceFx.doneData,
  target: $near,
});

// Logout logic
export const logoutClicked = createEvent();

const logoutFromWalletFx = attach({
  source: $walletSelectorState,
  async effect({modules, selectedWalletId}) {
    try {
      const module = modules.find((m) => m.id === selectedWalletId);

      if (!module) {
        throw new Error(`Wallet ${selectedWalletId} not found`);
      }

      const wallet = await module.wallet();

      // dont support hardware wallet
      if (wallet.type === 'hardware') {
        return;
      }

      await wallet.signOut();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';

      const error = new Error(`Failed to sign out: ${message}`) as Error & {originalError: unknown};

      error.originalError = err;

      throw err;
    }
  },
});

sample({
  clock: logoutClicked,
  target: logoutFromWalletFx,
});

// STREAMS ------------------------------------------------------------------------------- /

export const $currentDaoId = createStore('');
export const setCurrentDaoId = createEvent<string>();

export const lastCreatedStreamUpdated = createEvent<string>();

export const $roketoWallet = createStore<null | ApiControl>(null);
export const $tokens = createStore<Record<string, RichToken>>({});
export const $listedTokens = createStore<Record<string, RichToken>>({});
export const $priceOracle = createStore<PriceOracle>({
  getPriceInUsd: () => '0',
});
export const $accountStreams = createStore<{
  inputs: RoketoStream[];
  outputs: RoketoStream[];
  streamsLoaded: boolean;
}>({
  inputs: [],
  outputs: [],
  streamsLoaded: false,
});

const createRoketoWalletFx = createEffect(
  async ({
    account,
    accountId,
    transactionMediator,
  }: {
    account: Account;
    accountId: string;
    transactionMediator: TransactionMediator;
  }) => {
    const [apiControl, state] = await Promise.all([
      initApiControl({
        account,
        accountId,
        transactionMediator,
        roketoContractName: env.ROKETO_CONTRACT_NAME,
      }),
      account.state(),
    ]);

    const wNearId = env.WNEAR_ID;

    const {tokens: richTokens} = apiControl;

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
      ...apiControl,
      tokens: {
        ...richTokens,
        NEAR: nearAsToken,
      },
    };
  },
);

const createPriceOracleFx = createEffect((account: ConnectedWalletAccount) =>
  initPriceOracle({account}),
);

const requestAccountStreamsFx = createEffect(
  async ({accountId, contract}: Pick<ApiControl, 'contract' | 'accountId'>) => {
    const [inputs, outputs] = await Promise.all([
      getIncomingStreams({from: 0, limit: 500, accountId, contract}),
      getOutgoingStreams({from: 0, limit: 500, accountId, contract}),
    ]);
    return {inputs, outputs};
  },
);

export const requestUnknownTokensFx = createEffect(
  async ({
    tokenNames,
    roketo,
    nearAuth,
  }: {
    tokenNames: string[];
    roketo: ApiControl | null;
    nearAuth: NearAuth | null;
  }) => {
    if (!roketo || !nearAuth) return {};
    const requestResults = await Promise.all(
      tokenNames.map(async (tokenName) => {
        const [contract] = await roketo.contract.get_token({token_account_id: tokenName});
        return [tokenName, contract] as const;
      }),
    );
    const {accountId, contract} = roketo;
    const dao = await getDao({contract});
    const additionalTokens = await createRichContracts({
      tokensInfo: requestResults,
      dao,
      account: nearAuth.account,
      accountId,
    });
    return additionalTokens;
  },
);

const streamsRevalidationTimerFx = createEffect(
  () =>
    new Promise<void>((rs) => {
      setTimeout(rs, 30000);
    }),
);

const initRoketoClientFx = createEffect((near: NearInstance) => {
  const tokenProviderInstance = roketoTokenProvider(near.accountId, near);
  const apiConfigInstance = apiConfig(tokenProviderInstance);
  return {
    tokenProvider: tokenProviderInstance,
    apiConfig: apiConfig(tokenProviderInstance),
    usersApiClient: roketoUsersApiClient(apiConfigInstance),
    accountId: near.accountId,
  };
});
/**
 * when last_created_stream is changed or revalidation timer ends
 * read roketo wallet
 * check whether it exists
 * extract Roketo object from it
 * and start requesting account streams with it
 * */
sample({
  clock: [lastCreatedStreamUpdated, streamsRevalidationTimerFx.doneData],
  source: $roketoWallet,
  filter: Boolean,
  fn: ({accountId, contract}) => ({accountId, contract}),
  target: requestAccountStreamsFx,
});
/**
 * when account streams successfully requested
 * save them to store $accountStreams
 */
sample({
  clock: requestAccountStreamsFx.doneData,
  fn: ({inputs, outputs}) => ({
    inputs,
    outputs,
    streamsLoaded: true,
  }),
  target: $accountStreams,
});
sample({
  clock: initNearInstanceFx.doneData,
  filter: (near) => Boolean(near.accountId),
  target: initRoketoClientFx,
});

sample({
  source: $near,
  clock: $currentDaoId,
  filter: Boolean,
  fn: ({account, transactionMediator}, currentDaoId) => ({
    account,
    accountId: currentDaoId,
    transactionMediator,
  }),
  target: createRoketoWalletFx,
});

sample({
  clock: $roketoWallet,
  filter: Boolean,
  fn: (wallet) => wallet.roketoAccount.last_created_stream,
  target: lastCreatedStreamUpdated,
});

/**
 * when last_created_stream is changed or revalidation timer ends
 * read roketo wallet
 * check whether it exists
 * extract Roketo object from it
 * and start requesting account streams with it
 * */
sample({
  clock: [lastCreatedStreamUpdated, streamsRevalidationTimerFx.doneData, setCurrentDaoId],
  source: $roketoWallet,
  filter: Boolean,
  fn: ({accountId, contract}) => ({accountId, contract}),
  target: requestAccountStreamsFx,
});

sample({
  clock: createRoketoWalletFx.doneData,
  target: $roketoWallet,
});

sample({
  clock: createRoketoWalletFx.doneData,
  target: [$tokens, $listedTokens],
  fn: ({tokens}) => tokens,
});
sample({
  clock: initNearInstanceFx.doneData,
  fn: ({account}) => account,
  target: [createPriceOracleFx],
});
/**
 * when price oracle is initialized allow app to consume it from $priceOracle store
 */
sample({
  clock: createPriceOracleFx.doneData,
  target: $priceOracle,
});

sample({
  clock: requestUnknownTokensFx.doneData,
  source: $tokens,
  target: $tokens,
  fn(tokens, additionalTokens) {
    return filterRichTokensByBalance({
      ...tokens,
      ...additionalTokens,
    });
  },
});

$roketoWallet.reset([logoutFromWalletFx.done]);
$tokens.reset([logoutFromWalletFx.done]);
$priceOracle.reset([logoutFromWalletFx.done]);
$accountStreams.reset([logoutFromWalletFx.done]);
