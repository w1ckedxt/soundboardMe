import 'server-only';
import { put, list, del } from '@vercel/blob';
import type { Board } from './types';

const boardPath = (slug: string) => `boards/${slug}.json`;
const clipPrefix = (slug: string, clipId: string) => `clips/${slug}/${clipId}`;

export async function getBoard(slug: string): Promise<Board | null> {
  const path = boardPath(slug);
  const { blobs } = await list({ prefix: path, limit: 1 });
  const match = blobs.find(b => b.pathname === path);
  if (!match) return null;
  const res = await fetch(`${match.url}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return (await res.json()) as Board;
}

export async function putBoard(board: Board): Promise<void> {
  await put(boardPath(board.slug), JSON.stringify(board), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function putClipAudio(
  slug: string,
  clipId: string,
  audio: Blob,
): Promise<{ url: string }> {
  const ext = mimeToExt(audio.type);
  const result = await put(`${clipPrefix(slug, clipId)}.${ext}`, audio, {
    access: 'public',
    contentType: audio.type || 'audio/webm',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return { url: result.url };
}

export async function deleteClipAudio(slug: string, clipId: string): Promise<void> {
  const { blobs } = await list({ prefix: clipPrefix(slug, clipId), limit: 10 });
  if (blobs.length) await del(blobs.map(b => b.url));
}

function mimeToExt(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes('webm')) return 'webm';
  if (m.includes('mp4') || m.includes('aac') || m.includes('m4a')) return 'm4a';
  if (m.includes('mpeg') || m.includes('mp3')) return 'mp3';
  if (m.includes('ogg')) return 'ogg';
  if (m.includes('wav')) return 'wav';
  return 'webm';
}
