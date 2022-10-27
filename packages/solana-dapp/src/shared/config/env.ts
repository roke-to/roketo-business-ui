type EnvType = {
  DEV: boolean;
  PROD: boolean;
  APP_TITLE: string;

  COMMIT_HASH: string;
  BUILD_TIME: string;

  BASE_PUBLIC_PATH: string;
  RB_API: string;
  ROKETO_CONTRACT_NAME: string;
  ROKETO_FINANCE_CONTRACT_NAME: string;
  WEB_API_URL: string;
  ACCOUNT_SUFFIX: string;
  RB_UI_MAINNET: string;
  RB_UI_TESTNET: string;
  NETWORK_ID: 'mainnet' | 'testnet';
};

export const env: EnvType = {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  COMMIT_HASH: import.meta.env.VITE_COMMIT_HASH,
  BUILD_TIME: import.meta.env.VITE_BUILD_TIME,
  BASE_PUBLIC_PATH: import.meta.env.VITE_BASE_PUBLIC_PATH,
  RB_API: import.meta.env.VITE_RB_API,
  ROKETO_CONTRACT_NAME: import.meta.env.VITE_ROKETO_CONTRACT_NAME,
  ROKETO_FINANCE_CONTRACT_NAME: import.meta.env.VITE_ROKETO_FINANCE_CONTRACT_NAME,
  WEB_API_URL: import.meta.env.VITE_WEB_API_URL,
  ACCOUNT_SUFFIX: import.meta.env.VITE_ACCOUNT_SUFFIX,
  NETWORK_ID: import.meta.env.VITE_NETWORK_ID,
  RB_UI_MAINNET: import.meta.env.VITE_RB_UI_MAINNET,
  RB_UI_TESTNET: import.meta.env.VITE_RB_UI_TESTNET,
};
