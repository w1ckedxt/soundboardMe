import { NextRequest, NextResponse } from 'next/server';
import { getBoard, putBoard, deleteClipAudio } from '@/lib/storage';
import { hashToken } from '@/lib/slug';

export const runtime = 'nodejs';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; clipId: string }> },
) {
  const { slug, clipId } = await params;
  const editToken = req.headers.get('x-edit-token') ?? '';
  if (!editToken) {
    return NextResponse.json({ error: 'no token' }, { status: 401 });
  }

  const board = await getBoard(slug);
  if (!board) return NextResponse.json({ error: 'not found' }, { status: 404 });

  if ((await hashToken(editToken)) !== board.editTokenHash) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  board.clips = board.clips.filter(c => c.id !== clipId);
  await putBoard(board);
  await deleteClipAudio(slug, clipId);

  return NextResponse.json({ ok: true });
}
