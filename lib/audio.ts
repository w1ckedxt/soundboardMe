'use client';

const MIME_CANDIDATES = [
  'audio/mp4',
  'audio/mp4;codecs=mp4a.40.2',
  'audio/aac',
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

export function pickRecorderMime(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  return MIME_CANDIDATES.find(c => MediaRecorder.isTypeSupported(c)) ?? '';
}

export type RecordingHandle = {
  stop: () => Promise<{ blob: Blob; durationMs: number }>;
  cancel: () => void;
};

export async function startRecording(): Promise<RecordingHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mime = pickRecorderMime();
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  const started = Date.now();
  recorder.start();

  return {
    stop: () =>
      new Promise(resolve => {
        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          const actualMime = recorder.mimeType || mime || 'audio/mp4';
          resolve({
            blob: new Blob(chunks, { type: actualMime }),
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
    audio = new Audio();
    audio.preload = 'auto';
    audioCache.set(key, audio);
  }
  if (audio.src !== url) audio.src = url;
  try { audio.currentTime = 0; } catch {}
  const p = audio.play();
  if (p && typeof p.catch === 'function') {
    p.catch(err => console.error('[soundboard] play failed:', url, err));
  }
}
