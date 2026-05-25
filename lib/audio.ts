'use client';

export function pickRecorderMime(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return candidates.find(c => MediaRecorder.isTypeSupported(c)) ?? '';
}

export type RecordingHandle = {
  stop: () => Promise<{ blob: Blob; durationMs: number }>;
  cancel: () => void;
};

export async function startRecording(): Promise<RecordingHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mime = pickRecorderMime();
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  const started = Date.now();
  recorder.start();

  return {
    stop: () =>
      new Promise(resolve => {
        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          resolve({
            blob: new Blob(chunks, { type: mime || 'audio/webm' }),
            durationMs: Date.now() - started,
          });
        };
        recorder.stop();
      }),
    cancel: () => {
      try { recorder.stop(); } catch {}
      stream.getTracks().forEach(t => t.stop());
    },
  };
}

const audioCache = new Map<string, HTMLAudioElement>();

export function playUrl(key: string, url: string): void {
  let audio = audioCache.get(key);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = 'auto';
    audioCache.set(key, audio);
  }
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
