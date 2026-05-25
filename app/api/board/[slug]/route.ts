import { NextRequest, NextResponse } from 'next/server';
import { getBoard } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const board = await getBoard(slug);
  if (!board) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const { editTokenHash: _hash, ...publicBoard } = board;
  return NextResponse.json(publicBoard);
}
