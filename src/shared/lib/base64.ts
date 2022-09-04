export function encodeBase64(jsonStr: string): string {
  return Buffer.from(jsonStr).toString('base64');
}

export function jsonToBase64(data: Record<string, unknown>): string {
  return encodeBase64(JSON.stringify(data));
}
