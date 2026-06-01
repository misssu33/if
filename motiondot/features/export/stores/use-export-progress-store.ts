import { create } from 'zustand';

export type ExportSessionState = 'idle' | 'running' | 'success' | 'error';

interface ExportProgressUiState {
  session: ExportSessionState;
  activeBatchId: string | null;
  startedAt: number | null;
  simulatedFloor: number;
  enqueueError: string | null;
  /** Export 버튼 중복 클릭 방지 */
  isBlockingExport: boolean;
  beginSession: () => void;
  attachBatch: (batchId: string) => void;
  setSimulatedFloor: (value: number) => void;
  markSuccess: () => void;
  markError: (message?: string) => void;
  dismiss: () => void;
}

export const useExportProgressStore = create<ExportProgressUiState>((set) => ({
  session: 'idle',
  activeBatchId: null,
  startedAt: null,
  simulatedFloor: 0,
  enqueueError: null,
  isBlockingExport: false,

  beginSession: () =>
    set({
      session: 'running',
      activeBatchId: null,
      startedAt: Date.now(),
      simulatedFloor: 3,
      enqueueError: null,
      isBlockingExport: true,
    }),

  attachBatch: (batchId) =>
    set({
      activeBatchId: batchId,
      simulatedFloor: 8,
    }),

  setSimulatedFloor: (value) =>
    set((s) => ({
      simulatedFloor: Math.max(s.simulatedFloor, value),
    })),

  markSuccess: () =>
    set({
      session: 'success',
      simulatedFloor: 100,
      isBlockingExport: false,
    }),

  markError: (message) =>
    set({
      session: 'error',
      enqueueError: message ?? null,
      isBlockingExport: false,
    }),

  dismiss: () =>
    set({
      session: 'idle',
      activeBatchId: null,
      startedAt: null,
      simulatedFloor: 0,
      enqueueError: null,
      isBlockingExport: false,
    }),
}));
