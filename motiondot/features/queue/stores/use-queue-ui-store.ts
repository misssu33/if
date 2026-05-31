import { create } from 'zustand';

/** 큐 UI 전용: 추적 중인 jobId 목록 */
interface QueueUiState {
  activeJobIds: string[];
  trackJob: (jobId: string) => void;
  untrackJob: (jobId: string) => void;
}

export const useQueueUiStore = create<QueueUiState>((set) => ({
  activeJobIds: [],
  trackJob: (jobId) =>
    set((s) => ({
      activeJobIds: s.activeJobIds.includes(jobId)
        ? s.activeJobIds
        : [...s.activeJobIds, jobId],
    })),
  untrackJob: (jobId) =>
    set((s) => ({
      activeJobIds: s.activeJobIds.filter((id) => id !== jobId),
    })),
}));
