import {RichToken} from '@roketo/sdk/dist/types';

type RichTokens = {[p: string]: RichToken};

export function filterRichTokensByBalance(richTokens: RichTokens) {
  const tokenIds = Object.keys(richTokens);
  return tokenIds.reduce((prev, tokenId) => {
    const richToken = richTokens[tokenId];
    if (parseInt(richToken.balance, 10) > 0) {
      return {
        ...prev,
        [tokenId]: richToken,
      };
    }
    return prev;
  }, {} as RichTokens);
}
