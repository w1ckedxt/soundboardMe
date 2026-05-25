'use client';
import { useEffect, useState } from 'react';
import type { PublicBoard } from '@/lib/types';
import { SoundButton } from '@/components/SoundButton';
import { BoardHeader } from '@/components/BoardHeader';
import { ShareBar } from '@/components/ShareBar';
import { EmptyState } from '@/components/EmptyState';
import { playUrl } from '@/lib/audio';

export function ViewBoard({ board }: { board: PublicBoard }) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/s/${board.slug}`);
  }, [board.slug]);

  const handleRandom = () => {
    if (!board.clips.length) return;
    const clip = board.clips[Math.floor(Math.random() * board.clips.length)];
    playUrl(clip.id, clip.audioUrl);
  };

  return (
    <main className="min-h-screen pb-32">
      <BoardHeader name={board.name} emoji={board.emoji} clipCount={board.clips.length} slug={board.slug} />

      {board.clips.length === 0 ? (
        <EmptyState editable={false} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 max-w-5xl mx-auto">
          {board.clips.map((clip, i) => (
            <SoundButton
              key={clip.id}
              emoji={clip.emoji}
              label={clip.label}
              index={i}
              onPlay={() => playUrl(clip.id, clip.audioUrl)}
            />
          ))}
        </div>
      )}

      <ShareBar
        shareUrl={shareUrl}
        onRandom={board.clips.length > 0 ? handleRandom : undefined}
      />
    </main>
  );
}
