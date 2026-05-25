'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBoard } from '@/lib/api';
import { EmojiPicker } from '@/components/EmojiPicker';

export default function NewBoardPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💅');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { slug, editToken } = await createBoard(name.trim(), emoji);
      router.push(`/s/${slug}/edit?t=${editToken}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mislukt');
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <h1 className="text-3xl font-bold">Nieuwe soundboard</h1>
        </header>

        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide">Van wie?</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="bijv. Yasmijn"
            maxLength={40}
            autoFocus
            className="w-full mt-2 px-5 py-4 rounded-2xl bg-white/10 ring-1 ring-white/15 placeholder-white/30 outline-none focus:ring-pink-400 text-lg transition"
          />
        </div>

        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide">Emoji</label>
          <div className="mt-2">
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={!name.trim() || busy}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-lg shadow-[0_15px_50px_-10px_rgba(236,72,153,0.6)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition"
        >
          {busy ? 'aanmaken…' : 'maak soundboard →'}
        </button>

        <p className="text-white/40 text-xs text-center">
          Je krijgt straks een geheime edit-link. Bewaar die goed — kwijt = geen edits meer.
        </p>
      </div>
    </main>
  );
}
