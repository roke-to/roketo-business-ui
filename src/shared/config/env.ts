type EnvType = {
  APP_TITLE: string;
  NEAR_NETWORK_ID: 'testnet' | 'mainnet';
  WALLET_URL: string;
  COMMIT_HASH: string;
  BUILD_TIME: string;
  ASTRO_API: string;
  SPUTNIK_FACTORY_DAO_CONTRACT_NAME: string;
  BASE_PUBLIC_PATH: string;
  RB_API: string;
};

export const env: EnvType = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  NEAR_NETWORK_ID: import.meta.env.VITE_NEAR_NETWORK_ID,
  WALLET_URL: import.meta.env.VITE_WALLET_URL,
  COMMIT_HASH: import.meta.env.VITE_COMMIT_HASH,
  BUILD_TIME: import.meta.env.VITE_BUILD_TIME,
  ASTRO_API: import.meta.env.VITE_ASTRO_API,
  SPUTNIK_FACTORY_DAO_CONTRACT_NAME: import.meta.env.VITE_SPUTNIK_FACTORY_DAO_CONTRACT_NAME,
  BASE_PUBLIC_PATH: import.meta.env.VITE_BASE_PUBLIC_PATH,
  RB_API: import.meta.env.VITE_RB_API,
};
