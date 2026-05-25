'use client';

const PICKS = [
  '😂','😴','🙄','💅','🔥','😭','🫶','💃',
  '🤔','😎','🥺','😘','🤡','🎉','👀','💀',
  '✨','😈','🤌','🫠','😅','💖','🙏','😏',
];

type Props = {
  value: string;
  onChange: (emoji: string) => void;
};

export function EmojiPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {PICKS.map(e => (
        <button
          key={e}
          type="button"
          onClick={() => onChange(e)}
          className={`text-2xl aspect-square rounded-xl transition ${
            value === e
              ? 'bg-white/20 ring-2 ring-pink-400'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
