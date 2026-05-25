import { NextRequest, NextResponse } from 'next/server';
import { newSlug, newEditToken, hashToken } from '@/lib/slug';
import { putBoard, getBoard } from '@/lib/storage';
import type { Board } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? '').trim().slice(0, 60);
  const emoji = String(body.emoji ?? '🎤').slice(0, 8);
  if (!name) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  let slug = newSlug();
  for (let i = 0; i < 5; i++) {
    if (!(await getBoard(slug))) break;
    slug = newSlug();
  }

  const editToken = newEditToken();
  const board: Board = {
    slug,
    name,
    emoji,
    clips: [],
    editTokenHash: await hashToken(editToken),
    createdAt: Date.now(),
  };
  await putBoard(board);

  return NextResponse.json({ slug, editToken });
}
