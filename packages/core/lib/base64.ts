export function decodeBase64(jsonStr: string): string {
  return Buffer.from(jsonStr, 'base64').toString('utf-8');
}

export function encodeBase64(jsonStr: string): string {
  return Buffer.from(jsonStr).toString('base64');
}

export function jsonToBase64(data: Record<string, unknown>): string {
  return encodeBase64(JSON.stringify(data));
}

export function base64ToJson(jsonStr: string): Record<string, any> {
  return JSON.parse((decodeBase64(jsonStr)))
}
