import { create } from 'zustand';
import type { ImageCompressionPresetId } from '@/lib/image/compression-presets';

interface ImageCompressionState {
  presetId: ImageCompressionPresetId;
  /** 마지막 업로드 압축 결과 (UI 표시용) */
  lastUploadSummary: string | null;
  setPresetId: (id: ImageCompressionPresetId) => void;
  setLastUploadSummary: (summary: string | null) => void;
}

export const useImageCompressionStore = create<ImageCompressionState>((set) => ({
  presetId: 'off',
  lastUploadSummary: null,
  setPresetId: (presetId) => set({ presetId }),
  setLastUploadSummary: (lastUploadSummary) => set({ lastUploadSummary }),
}));
