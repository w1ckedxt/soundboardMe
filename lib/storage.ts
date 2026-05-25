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
  const res = await fetch(match.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return (await res.json()) as Board;
}

export async function putBoard(board: Board): Promise<void> {
  await put(boardPath(board.slug), JSON.stringify(board), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
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
  if (mime.includes('webm')) return 'webm';
  if (mime.includes('mp4')) return 'm4a';
  if (mime.includes('mpeg')) return 'mp3';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('wav')) return 'wav';
  return 'webm';
}
