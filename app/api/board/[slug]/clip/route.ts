import { NextRequest, NextResponse } from 'next/server';
import { getBoard, putBoard, putClipAudio } from '@/lib/storage';
import { newClipId, hashToken } from '@/lib/slug';
import type { Clip } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_AUDIO_BYTES = 5_000_000;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const editToken = req.headers.get('x-edit-token') ?? '';
  if (!editToken) {
    return NextResponse.json({ error: 'no token' }, { status: 401 });
  }

  const board = await getBoard(slug);
  if (!board) return NextResponse.json({ error: 'not found' }, { status: 404 });

  if ((await hashToken(editToken)) !== board.editTokenHash) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const url = new URL(req.url);
  const emoji = (url.searchParams.get('emoji') ?? '🎤').slice(0, 8);
  const label = (url.searchParams.get('label') ?? '').trim().slice(0, 40);
  const durationMs = Number(url.searchParams.get('durationMs') ?? 0);

  if (!label) {
    return NextResponse.json({ error: 'label required' }, { status: 400 });
  }

  const audio = await req.blob();
  if (!audio.size) {
    return NextResponse.json({ error: 'no audio' }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: `audio te groot (max ${MAX_AUDIO_BYTES / 1_000_000}MB)` }, { status: 413 });
  }

  const clipId = newClipId();
  const { url: audioUrl } = await putClipAudio(slug, clipId, audio);

  const clip: Clip = {
    id: clipId,
    emoji,
    label,
    audioUrl,
    durationMs,
    createdAt: Date.now(),
  };

  board.clips.push(clip);
  await putBoard(board);

  return NextResponse.json(clip);
}
