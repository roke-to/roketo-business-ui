import {type Cluster} from '@solana/web3.js';

export default function getInferredClusterFromEndpoint(endpoint?: string): Cluster {
  if (!endpoint) {
    return 'mainnet-beta';
  }
  if (/devnet/i.test(endpoint)) {
    return 'devnet';
  }
  if (/testnet/i.test(endpoint)) {
    return 'testnet';
  }
  return 'mainnet-beta';
}
