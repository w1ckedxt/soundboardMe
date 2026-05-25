'use client';
import { useState } from 'react';

const GRADIENTS = [
  'from-pink-500 to-orange-400',
  'from-fuchsia-500 to-violet-600',
  'from-cyan-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-emerald-400 to-cyan-500',
  'from-rose-500 to-pink-500',
];

type Props = {
  emoji: string;
  label: string;
  index: number;
  onPlay: () => void;
  onDelete?: () => void;
};

export function SoundButton({ emoji, label, index, onPlay, onDelete }: Props) {
  const [pressed, setPressed] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const tilt = ((index % 5) - 2) * 0.7;

  return (
    <div className="relative" style={{ rotate: `${tilt}deg` }}>
      {onDelete && (
        <button
          aria-label="Verwijder"
          onClick={onDelete}
          className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-black/70 text-white text-xs ring-1 ring-white/25 hover:bg-red-500 transition"
        >
          ✕
        </button>
      )}
      <button
        onPointerDown={() => { setPressed(true); onPlay(); }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={`
          w-full aspect-square rounded-[2rem] p-4 text-left
          bg-gradient-to-br ${gradient}
          shadow-[0_15px_40px_-12px_rgba(236,72,153,0.5)]
          ring-1 ring-white/25
          transition-transform duration-150 ease-out
          ${pressed ? 'scale-95' : 'hover:scale-[1.04]'}
        `}
      >
        <div className="text-5xl drop-shadow-lg mb-2 leading-none">{emoji}</div>
        <div className="text-white font-semibold text-sm drop-shadow leading-tight line-clamp-2">
          {label}
        </div>
      </button>
    </div>
  );
}
