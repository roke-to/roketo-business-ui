type EnvType = {
  DEV: boolean;
  PROD: boolean;
  APP_TITLE: string;
  NEAR_NETWORK_ID: 'testnet' | 'mainnet';
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
  NEAR_NETWORK_WAITING: number;
  EXPLORER_URL: string;
  TRACKING_ID: string;
  INTERCOM_ID: string;
  APP_NAME: string;
};

export const env: EnvType = {
  DEV: process.env.DEV,
  PROD: process.env.PROD,
  APP_TITLE: process.env.VITE_APP_TITLE,
  NEAR_NETWORK_ID: process.env.VITE_NETWORK_ID,
  NEAR_WALLET_URL: process.env.VITE_NEAR_WALLET_URL,
  MY_NEAR_WALLET_URL: process.env.VITE_MY_NEAR_WALLET_URL,
  COMMIT_HASH: process.env.VITE_COMMIT_HASH,
  BUILD_TIME: process.env.VITE_BUILD_TIME,
  ASTRO_API: process.env.VITE_ASTRO_API,
  SPUTNIK_FACTORY_DAO_CONTRACT_NAME: process.env.VITE_SPUTNIK_FACTORY_DAO_CONTRACT_NAME,
  BASE_PUBLIC_PATH: process.env.VITE_BASE_PUBLIC_PATH,
  RB_API: process.env.VITE_RB_API,
  ROKETO_CONTRACT_NAME: process.env.VITE_ROKETO_CONTRACT_NAME,
  ROKETO_FINANCE_CONTRACT_NAME: process.env.VITE_ROKETO_FINANCE_CONTRACT_NAME,
  WNEAR_ID: process.env.VITE_WNEAR_ID,
  PRICE_ORACLE_SOURCE_ID: process.env.VITE_PRICE_ORACLE_SOURCE_ID,
  WEB_API_URL: process.env.VITE_WEB_API_URL,
  ACCOUNT_SUFFIX: process.env.VITE_NEAR_ACCOUNT_SUFFIX,
  PRICE_ORACLE_CONTRACT_NAME: process.env.VITE_PRICE_ORACLE_CONTRACT_NAME,
  NEAR_NODE_URL: process.env.VITE_NEAR_NODE_URL,
  RB_UI_MAINNET: process.env.VITE_RB_UI_MAINNET,
  RB_UI_TESTNET: process.env.VITE_RB_UI_TESTNET,
  NEAR_NETWORK_WAITING: Number(process.env.VITE_NEAR_NETWORK_WAITING),
  EXPLORER_URL: process.env.VITE_EXPLORER_URL,
  TRACKING_ID: process.env.VITE_TRACKING_ID,
  INTERCOM_ID: process.env.VITE_INTERCOM_ID,
  APP_NAME: process.env.VITE_APP_NAME,
};