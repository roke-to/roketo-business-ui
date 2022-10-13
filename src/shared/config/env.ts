import {NetworkId} from '~/shared/api/near/options';

type EnvType = {
  DEV: boolean;
  PROD: boolean;
  APP_TITLE: string;
  NEAR_NETWORK_ID: NetworkId;
  NEAR_WALLET_URL: string;
  MY_NEAR_WALLET_URL: string;
  COMMIT_HASH: string;
  BUILD_TIME: string;
  ASTRO_API: string;
  SPUTNIK_FACTORY_DAO_CONTRACT_NAME: string;
  BASE_PUBLIC_PATH: string;
  RB_API: string;
  ROKETO_CONTRACT_NAME: string;
  ROKETO_FINANCE_CONTRACT_NAME: string;
  WNEAR_ID: string;
  PRICE_ORACLE_SOURCE_ID: string;
  WEB_API_URL: string;
  ACCOUNT_SUFFIX: string;
  PRICE_ORACLE_CONTRACT_NAME: string;
  NEAR_NODE_URL: string;
  RB_UI_MAINNET: string;
  RB_UI_TESTNET: string;
};

export const env: EnvType = {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  NEAR_NETWORK_ID: import.meta.env.VITE_NEAR_NETWORK_ID,
  NEAR_WALLET_URL: import.meta.env.VITE_NEAR_WALLET_URL,
  MY_NEAR_WALLET_URL: import.meta.env.VITE_MY_NEAR_WALLET_URL,
  COMMIT_HASH: import.meta.env.VITE_COMMIT_HASH,
  BUILD_TIME: import.meta.env.VITE_BUILD_TIME,
  ASTRO_API: import.meta.env.VITE_ASTRO_API,
  SPUTNIK_FACTORY_DAO_CONTRACT_NAME: import.meta.env.VITE_SPUTNIK_FACTORY_DAO_CONTRACT_NAME,
  BASE_PUBLIC_PATH: import.meta.env.VITE_BASE_PUBLIC_PATH,
  RB_API: import.meta.env.VITE_RB_API,
  ROKETO_CONTRACT_NAME: import.meta.env.VITE_ROKETO_CONTRACT_NAME,
  ROKETO_FINANCE_CONTRACT_NAME: import.meta.env.VITE_ROKETO_FINANCE_CONTRACT_NAME,
  WNEAR_ID: import.meta.env.VITE_WNEAR_ID,
  PRICE_ORACLE_SOURCE_ID: import.meta.env.VITE_PRICE_ORACLE_SOURCE_ID,
  WEB_API_URL: import.meta.env.VITE_WEB_API_URL,
  ACCOUNT_SUFFIX: import.meta.env.VITE_NEAR_ACCOUNT_SUFFIX,
  PRICE_ORACLE_CONTRACT_NAME: import.meta.env.VITE_PRICE_ORACLE_CONTRACT_NAME,
  NEAR_NODE_URL: import.meta.env.VITE_NEAR_NODE_URL,
  RB_UI_MAINNET: import.meta.env.VITE_RB_UI_MAINNET,
  RB_UI_TESTNET: import.meta.env.VITE_RB_UI_TESTNET,
};
