declare module 'near-seed-phrase' {
  export function generateSeedPhrase(): {
    seedPhrase: string;
    publicKey: string;
  };
}
