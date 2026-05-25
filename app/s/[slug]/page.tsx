import { notFound } from 'next/navigation';
import { getBoard } from '@/lib/storage';
import { ViewBoard } from './ViewBoard';

export const dynamic = 'force-dynamic';

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = await getBoard(slug);
  if (!board) notFound();

  return (
    <ViewBoard
      board={{
        slug: board.slug,
        name: board.name,
        emoji: board.emoji,
        clips: board.clips,
        createdAt: board.createdAt,
      }}
    />
  );
}
