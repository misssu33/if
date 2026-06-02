import { create } from 'zustand';
import type { OutputFormat } from '@/types';

interface ExportSessionState {
  selectedFormats: OutputFormat[];
  namingPattern: string;
  lastBatchId: string | null;
  toggleFormat: (format: OutputFormat) => void;
  setFormats: (formats: OutputFormat[]) => void;
  setNamingPattern: (pattern: string) => void;
  setLastBatchId: (id: string | null) => void;
}

export const useExportSessionStore = create<ExportSessionState>((set, get) => ({
  selectedFormats: ['gif'],
  namingPattern: '{name}-{format}',
  lastBatchId: null,
  toggleFormat: (format) => {
    const current = get().selectedFormats;
    const next = current.includes(format)
      ? current.filter((f) => f !== format)
      : [...current, format];
    set({ selectedFormats: next.length ? next : [format] });
  },
  setFormats: (formats) =>
    set({ selectedFormats: formats.length ? formats : ['mp4'] }),
  setNamingPattern: (pattern) => set({ namingPattern: pattern }),
  setLastBatchId: (id) => set({ lastBatchId: id }),
}));
