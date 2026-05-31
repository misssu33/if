import { create } from 'zustand';
import type { OutputFormat, UploadFileMeta } from '@/types';

/** 배치 변환 전역 상태 (Zustand) */
interface BatchState {
  files: UploadFileMeta[];
  presetId: string | null;
  format: OutputFormat;
  addFiles: (files: UploadFileMeta[]) => void;
  removeFile: (id: string) => void;
  setPresetId: (id: string) => void;
  setFormat: (format: OutputFormat) => void;
  reset: () => void;
}

const initialState = {
  files: [] as UploadFileMeta[],
  presetId: null as string | null,
  format: 'mp4' as OutputFormat,
};

export const useBatchStore = create<BatchState>((set) => ({
  ...initialState,
  addFiles: (files) =>
    set((s) => ({ files: [...s.files, ...files] })),
  removeFile: (id) =>
    set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
  setPresetId: (presetId) => set({ presetId }),
  setFormat: (format) => set({ format }),
  reset: () => set(initialState),
}));
