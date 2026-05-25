import { customAlphabet } from 'nanoid';

const SAFE = '23456789abcdefghjkmnpqrstuvwxyz';

export const newSlug = customAlphabet(SAFE, 6);
export const newEditToken = customAlphabet(SAFE, 24);
export const newClipId = customAlphabet(SAFE, 10);

export async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
