import { create } from 'zustand';
import type { UploadFileMeta } from '@/types';

/** 업로드 파일 전역 상태 (프리셋은 features/presets) */
interface BatchState {
  files: UploadFileMeta[];
  addFiles: (files: UploadFileMeta[]) => void;
  removeFile: (id: string) => void;
  reset: () => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  files: [],
  addFiles: (files) =>
    set((s) => ({ files: [...s.files, ...files] })),
  removeFile: (id) =>
    set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
  reset: () => set({ files: [] }),
}));
