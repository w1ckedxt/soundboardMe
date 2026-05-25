'use client';
import { useEffect, useState } from 'react';
import { startRecording, type RecordingHandle, playUrl } from '@/lib/audio';
import { EmojiPicker } from './EmojiPicker';

type SavePayload = { emoji: string; label: string; audio: Blob; durationMs: number };
type Phase = 'idle' | 'recording' | 'review' | 'saving';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (clip: SavePayload) => Promise<void>;
};

export function RecordModal({ open, onClose, onSave }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [emoji, setEmoji] = useState('🎤');
  const [label, setLabel] = useState('');
  const [recording, setRecording] = useState<RecordingHandle | null>(null);
  const [preview, setPreview] = useState<{ url: string; blob: Blob; durationMs: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    setPhase('idle');
    setEmoji('🎤');
    setLabel('');
    setError(null);
    if (recording) recording.cancel();
    setRecording(null);
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }, [open]);

  const startRec = async () => {
    setError(null);
    try {
      const handle = await startRecording();
      setRecording(handle);
      setPhase('recording');
    } catch {
      setError('Microfoon toegang geweigerd. Sta het toe in je browser.');
    }
  };

  const stopRec = async () => {
    if (!recording) return;
    const result = await recording.stop();
    setRecording(null);
    const url = URL.createObjectURL(result.blob);
    setPreview({ url, blob: result.blob, durationMs: result.durationMs });
    setPhase('review');
  };

  const retake = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setPhase('idle');
  };

  const save = async () => {
    if (!preview || !label.trim()) return;
    setPhase('saving');
    try {
      await onSave({ emoji, label: label.trim(), audio: preview.blob, durationMs: preview.durationMs });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kon niet opslaan');
      setPhase('review');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-zinc-950 ring-1 ring-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Nieuwe sound</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl px-2">✕</button>
        </div>

        {phase === 'idle' && (
          <div className="text-center py-8">
            <button
              onClick={startRec}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white text-5xl shadow-[0_20px_50px_-15px_rgba(236,72,153,0.7)] hover:scale-105 active:scale-95 transition"
            >
              🎤
            </button>
            <p className="mt-6 text-white/60">Tik om op te nemen</p>
            {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
          </div>
        )}

        {phase === 'recording' && (
          <div className="text-center py-8">
            <button
              onClick={stopRec}
              className="w-32 h-32 rounded-3xl bg-red-500 text-white text-5xl shadow-[0_20px_50px_-15px_rgba(239,68,68,0.7)] hover:scale-105 active:scale-95 transition animate-pulse"
            >
              ⏹
            </button>
            <p className="mt-6 text-white/60">Opnemen… tik om te stoppen</p>
          </div>
        )}

        {phase === 'review' && preview && (
          <div className="space-y-4">
            <button
              onClick={() => playUrl('preview', preview.url)}
              className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 font-semibold transition"
            >
              ▶ luister preview ({(preview.durationMs / 1000).toFixed(1)}s)
            </button>

            <div>
              <label className="text-white/60 text-xs uppercase tracking-wide">Emoji</label>
              <div className="mt-2">
                <EmojiPicker value={emoji} onChange={setEmoji} />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs uppercase tracking-wide">Label</label>
              <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="bijv. 'echt niet'"
                maxLength={40}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/10 ring-1 ring-white/15 placeholder-white/30 outline-none focus:ring-pink-400 transition"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={retake}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 font-semibold transition"
              >
                opnieuw
              </button>
              <button
                onClick={save}
                disabled={!label.trim()}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                bewaar
              </button>
            </div>
          </div>
        )}

        {phase === 'saving' && (
          <div className="text-center py-12 text-white/60">opslaan…</div>
        )}
      </div>
    </div>
  );
}
