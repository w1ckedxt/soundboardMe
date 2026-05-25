'use client';
import { useState } from 'react';

type Props = {
  shareUrl: string;
  onRandom?: () => void;
};

export function ShareBar({ shareUrl, onRandom }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40">
      {onRandom && (
        <button
          onClick={onRandom}
          className="px-6 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-[0_10px_30px_-5px_rgba(251,146,60,0.5)] hover:scale-105 active:scale-95 transition"
        >
          🎲 random
        </button>
      )}
      <button
        onClick={handleShare}
        className="px-6 py-4 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 text-white font-bold hover:bg-white/15 active:scale-95 transition"
      >
        {copied ? '✅ gekopieerd' : '🔗 share'}
      </button>
    </div>
  );
}
