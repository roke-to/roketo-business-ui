export function jsonToBase64(data: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}
