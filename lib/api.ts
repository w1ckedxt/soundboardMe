import type { PublicBoard, Clip } from './types';

export async function createBoard(name: string, emoji: string): Promise<{
  slug: string;
  editToken: string;
}> {
  const res = await fetch('/api/board', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, emoji }),
  });
  if (!res.ok) throw new Error(await errText(res, 'Kon soundboard niet aanmaken'));
  return res.json();
}

export async function fetchBoard(slug: string): Promise<PublicBoard | null> {
  const res = await fetch(`/api/board/${slug}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await errText(res, 'Kon soundboard niet laden'));
  return res.json();
}

export async function addClip(
  slug: string,
  editToken: string,
  payload: { emoji: string; label: string; audio: Blob; durationMs: number },
): Promise<Clip> {
  const form = new FormData();
  form.append('emoji', payload.emoji);
  form.append('label', payload.label);
  form.append('durationMs', String(payload.durationMs));
  form.append('audio', payload.audio, 'clip');
  const res = await fetch(`/api/board/${slug}/clip`, {
    method: 'POST',
    headers: { 'x-edit-token': editToken },
    body: form,
  });
  if (!res.ok) throw new Error(await errText(res, 'Kon clip niet opslaan'));
  return res.json();
}

export async function deleteClip(
  slug: string,
  clipId: string,
  editToken: string,
): Promise<void> {
  const res = await fetch(`/api/board/${slug}/clip/${clipId}`, {
    method: 'DELETE',
    headers: { 'x-edit-token': editToken },
  });
  if (!res.ok) throw new Error(await errText(res, 'Kon clip niet verwijderen'));
}

async function errText(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.error === 'string' ? data.error : fallback;
  } catch {
    return fallback;
  }
}
