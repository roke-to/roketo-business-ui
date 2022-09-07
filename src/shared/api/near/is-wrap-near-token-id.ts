export function isWNearTokenId({
  tokenAccountId,
  wNearId,
}: {
  tokenAccountId: string;
  wNearId: string;
}) {
  return tokenAccountId === wNearId;
}
