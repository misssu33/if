import { create } from 'zustand';
import type { UploadQueueItem } from '../types/upload-queue';

interface UploadUiState {
  items: UploadQueueItem[];
  rejectionMessage: string | null;
  isUploading: boolean;
  setRejectionMessage: (message: string | null) => void;
  enqueueFiles: (files: File[]) => string[];
  updateItem: (localId: string, patch: Partial<UploadQueueItem>) => void;
  removeItem: (localId: string) => void;
  clearSuccessful: () => void;
  setUploading: (value: boolean) => void;
}

export const useUploadUiStore = create<UploadUiState>((set) => ({
  items: [],
  rejectionMessage: null,
  isUploading: false,
  setRejectionMessage: (message) => set({ rejectionMessage: message }),
  enqueueFiles: (files) => {
    const localIds: string[] = [];
    const newItems: UploadQueueItem[] = files.map((file) => {
      const localId = crypto.randomUUID();
      localIds.push(localId);
      return {
        localId,
        file,
        status: 'queued',
        progress: 0,
      };
    });
    set((s) => ({ items: [...s.items, ...newItems] }));
    return localIds;
  },
  updateItem: (localId, patch) =>
    set((s) => ({
      items: s.items.map((item) =>
        item.localId === localId ? { ...item, ...patch } : item,
      ),
    })),
  removeItem: (localId) =>
    set((s) => ({
      items: s.items.filter((item) => item.localId !== localId),
    })),
  clearSuccessful: () =>
    set((s) => ({
      items: s.items.filter((item) => item.status !== 'success'),
    })),
  setUploading: (isUploading) => set({ isUploading }),
}));
