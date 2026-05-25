'use client';

type Props = { onClick: () => void };

export function AddClipFAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Nieuwe sound opnemen"
      className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white text-3xl shadow-[0_15px_40px_-10px_rgba(236,72,153,0.7)] ring-1 ring-white/30 hover:scale-110 active:scale-95 transition"
    >
      +
    </button>
  );
}
