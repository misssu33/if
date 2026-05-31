import { create } from 'zustand';
import type { LoadedVideo } from '../lib/load-video-element';
import {
  BROWSER_GIF_FPS_DEFAULT,
  BROWSER_GIF_WIDTH_DEFAULT,
} from '../constants';

export type VideoGifPhase = 'idle' | 'loading' | 'ready' | 'converting' | 'done' | 'error';

interface VideoGifState {
  file: File | null;
  fileName: string | null;
  loaded: LoadedVideo | null;
  trimStartSec: number;
  trimEndSec: number;
  fps: number;
  outputWidth: number;
  previewTimeSec: number;
  phase: VideoGifPhase;
  progress: number;
  progressLabel: string;
  error: string | null;
  resultBlobUrl: string | null;
  resultBytes: Uint8Array | null;

  setFile: (file: File | null, name?: string) => void;
  setLoaded: (loaded: LoadedVideo | null) => void;
  setTrim: (startSec: number, endSec: number) => void;
  setFps: (fps: number) => void;
  setOutputWidth: (width: number) => void;
  setPreviewTimeSec: (t: number) => void;
  setPhase: (phase: VideoGifPhase) => void;
  setProgress: (progress: number, label?: string) => void;
  setError: (error: string | null) => void;
  setResult: (bytes: Uint8Array | null, blobUrl: string | null) => void;
  reset: () => void;
}

const initial = {
  file: null as File | null,
  fileName: null as string | null,
  loaded: null as LoadedVideo | null,
  trimStartSec: 0,
  trimEndSec: 0,
  fps: BROWSER_GIF_FPS_DEFAULT,
  outputWidth: BROWSER_GIF_WIDTH_DEFAULT,
  previewTimeSec: 0,
  phase: 'idle' as VideoGifPhase,
  progress: 0,
  progressLabel: '',
  error: null as string | null,
  resultBlobUrl: null as string | null,
  resultBytes: null as Uint8Array | null,
};

export const useVideoGifStore = create<VideoGifState>((set) => ({
  ...initial,

  setFile: (file, name) =>
    set({
      file,
      fileName: name ?? file?.name ?? null,
      phase: file ? 'loading' : 'idle',
      error: null,
      resultBlobUrl: null,
      resultBytes: null,
    }),

  setLoaded: (loaded) =>
    set((s) => ({
      loaded,
      trimStartSec: 0,
      trimEndSec: loaded?.durationSec ?? 0,
      previewTimeSec: 0,
      phase: loaded ? 'ready' : s.file ? 'loading' : 'idle',
    })),

  setTrim: (trimStartSec, trimEndSec) => set({ trimStartSec, trimEndSec }),
  setFps: (fps) => set({ fps }),
  setOutputWidth: (outputWidth) => set({ outputWidth }),
  setPreviewTimeSec: (previewTimeSec) => set({ previewTimeSec }),
  setPhase: (phase) => set({ phase }),
  setProgress: (progress, progressLabel) =>
    set((s) => ({
      progress,
      progressLabel: progressLabel ?? s.progressLabel,
    })),
  setError: (error) => set({ error, phase: error ? 'error' : 'idle' }),
  setResult: (resultBytes, resultBlobUrl) =>
    set({ resultBytes, resultBlobUrl, phase: 'done', progress: 100 }),

  reset: () => set({ ...initial }),
}));
