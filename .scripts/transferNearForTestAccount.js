const {KeyPair, connect, keyStores} = require('near-api-js');

const {customAlphabet} = require('nanoid');

// Top-level account (TLA) is testnet for foo.alice.testnet
const TLA_MIN_LENGTH = 32;

async function transferNearForTestAccount() {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
  const accountId = nanoid(TLA_MIN_LENGTH).toLowerCase();

  console.log('createAccount accountId ', accountId);

  const beneficiaryId = process.env.BENEFICIARY_ID || 'rocketobiztestuser.testnet';
  const networkId = process.env.NEAR_NETWORK_ID || 'testnet';

  const keyStore = new keyStores.InMemoryKeyStore();

  const near = await connect({
    keyStore,
    networkId,
    walletUrl: process.env.NEAR_WALLET_URL || 'https://wallet.testnet.near.org',
    nodeUrl: 'https://rpc.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
    indexerUrl: 'https://testnet-api.kitwallet.app',
  });

  const keyPair = await KeyPair.fromRandom('ed25519');
  const publicKey = keyPair.getPublicKey();

  // Check to see if account already exists
  try {
    // create a new account using funds from the account used to create it.
    await near.accountCreator.createAccount(accountId, publicKey);
  } catch (e) {
    if (!e.message.includes('does not exist while viewing')) {
      throw e;
    }
  }

  await keyStore.setKey(networkId, accountId, keyPair);

  // Delete account and transfer NFTs and FTs to the beneficiary address
  try {
    const account = await near.account(accountId);
    await account.deleteAccount(beneficiaryId);

    console.log(`Account ${accountId} for network "${networkId}" was deleted.`);
  } catch (error) {
    console.error(error);

    throw error;
  }
}

transferNearForTestAccount()
  .then(() => {
    console.log('Transfer successfully');
  })
  .catch(console.error);
