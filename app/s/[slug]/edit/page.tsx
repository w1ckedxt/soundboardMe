'use client';
import { use, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { PublicBoard } from '@/lib/types';
import { SoundButton } from '@/components/SoundButton';
import { BoardHeader } from '@/components/BoardHeader';
import { ShareBar } from '@/components/ShareBar';
import { AddClipFAB } from '@/components/AddClipFAB';
import { RecordModal } from '@/components/RecordModal';
import { EmptyState } from '@/components/EmptyState';
import { fetchBoard, addClip, deleteClip } from '@/lib/api';
import { playUrl } from '@/lib/audio';

export default function EditBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const search = useSearchParams();
  const router = useRouter();
  const editToken = search.get('t') ?? '';

  const [board, setBoard] = useState<PublicBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [recordOpen, setRecordOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (!editToken) {
      router.replace(`/s/${slug}`);
      return;
    }
    setShareUrl(`${window.location.origin}/s/${slug}`);
    fetchBoard(slug).then(b => {
      setBoard(b);
      setLoading(false);
    });
  }, [slug, editToken, router]);

  const handleSaveClip = async (input: {
    emoji: string;
    label: string;
    audio: Blob;
    durationMs: number;
  }) => {
    const clip = await addClip(slug, editToken, input);
    setBoard(b => (b ? { ...b, clips: [...b.clips, clip] } : b));
  };

  const handleDelete = async (clipId: string) => {
    if (!confirm('Verwijder deze sound?')) return;
    await deleteClip(slug, clipId, editToken);
    setBoard(b => (b ? { ...b, clips: b.clips.filter(c => c.id !== clipId) } : b));
  };

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-white/50">laden…</main>;
  }
  if (!board) {
    return <main className="min-h-screen flex items-center justify-center text-white/50">niet gevonden</main>;
  }

  return (
    <main className="min-h-screen pb-32">
      <BoardHeader name={board.name} emoji={board.emoji} clipCount={board.clips.length} slug={board.slug} />

      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs ring-1 ring-pink-400/30">
          ✏️ edit mode — bewaar deze URL goed
        </span>
      </div>

      {board.clips.length === 0 ? (
        <EmptyState editable />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 max-w-5xl mx-auto">
          {board.clips.map((clip, i) => (
            <SoundButton
              key={clip.id}
              emoji={clip.emoji}
              label={clip.label}
              index={i}
              onPlay={() => playUrl(clip.id, clip.audioUrl)}
              onDelete={() => handleDelete(clip.id)}
            />
          ))}
        </div>
      )}

      <AddClipFAB onClick={() => setRecordOpen(true)} />
      <ShareBar shareUrl={shareUrl} />
      <RecordModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        onSave={handleSaveClip}
      />
    </main>
  );
}
