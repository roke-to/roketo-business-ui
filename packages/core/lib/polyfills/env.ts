// This is necessary because near-api-js has process.env.NEAR_NO_LOGS in bundle
// and app is crashed in browser after trying to access process.env
// TODO: move to globalThis
(window as any).process = {env: {...(window as any).process?.env}};

export {};
