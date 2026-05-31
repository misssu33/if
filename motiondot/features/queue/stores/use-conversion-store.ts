import { create } from 'zustand';
import type { PresetQualityLevel, UploadFileMeta } from '@/types';
import type { BatchProgressState, ConversionJobItem } from '../types';
import { computeBatchProgress } from '../utils/compute-batch-progress';
import { mapServerStatus } from '../utils/map-server-status';

export interface RegisterBatchJobItem {
  fileId: string;
  fileName: string;
  inputPath: string;
  presetId: string;
  format: ConversionJobItem['format'];
  quality?: PresetQualityLevel;
  width: number;
  height: number;
  fps: number;
  loop?: boolean;
  maxFileSizeBytes?: number;
}

interface RegisterBatchInput {
  batchId: string;
  jobIds: string[];
  /** 다중 포맷 배치: jobIds와 1:1 */
  items?: RegisterBatchJobItem[];
  files?: UploadFileMeta[];
  presetId: string;
  format: ConversionJobItem['format'];
  quality?: PresetQualityLevel;
  width: number;
  height: number;
  fps: number;
  loop?: boolean;
  maxFileSizeBytes?: number;
}

interface ConversionState {
  jobs: ConversionJobItem[];
  batch: BatchProgressState;
  uploadFiles: UploadFileMeta[];
  syncUploadFiles: (files: UploadFileMeta[]) => void;
  registerBatch: (input: RegisterBatchInput) => void;
  applyServerProgress: (
    updates: {
      jobId: string;
      status: string;
      progress: number;
      message?: string;
      error?: string;
      outputPath?: string;
    }[],
  ) => void;
  setJobStatus: (jobId: string, patch: Partial<ConversionJobItem>) => void;
  markJobCancelled: (jobId: string) => void;
  replaceJobId: (oldJobId: string, newJobId: string) => void;
  getJob: (jobId: string) => ConversionJobItem | undefined;
  reset: () => void;
}

const emptyBatch = (): BatchProgressState => computeBatchProgress(null, []);

export const useConversionStore = create<ConversionState>((set, get) => ({
  jobs: [],
  batch: emptyBatch(),
  uploadFiles: [],

  syncUploadFiles: (files) => set({ uploadFiles: files }),

  registerBatch: (input) => {
    const {
      batchId,
      jobIds,
      items,
      files = [],
      presetId,
      format,
      quality,
      width,
      height,
      fps,
      loop,
      maxFileSizeBytes,
    } = input;

    const jobs: ConversionJobItem[] = items
      ? items.map((item, i) => ({
          ...item,
          jobId: jobIds[i] ?? '',
          batchId,
          status: 'queued' as const,
          progress: 0,
        }))
      : files.map((file, i) => ({
          fileId: file.id,
          jobId: jobIds[i] ?? '',
          batchId,
          fileName: file.originalName,
          inputPath: file.tempPath,
          presetId,
          format,
          quality,
          width,
          height,
          fps,
          loop,
          maxFileSizeBytes,
          status: 'queued' as const,
          progress: 0,
        }));

    set({
      jobs,
      batch: computeBatchProgress(batchId, jobs),
    });
  },

  applyServerProgress: (updates) => {
    set((s) => {
      const jobs = s.jobs.map((job) => {
        const u = updates.find((x) => x.jobId === job.jobId);
        if (!u) return job;
        if (job.status === 'cancelled') return job;
        return {
          ...job,
          status: mapServerStatus(u.status),
          progress: u.progress,
          message: u.message,
          error: u.error,
          outputPath: u.outputPath,
        };
      });
      return {
        jobs,
        batch: computeBatchProgress(s.batch.batchId, jobs),
      };
    });
  },

  setJobStatus: (jobId, patch) =>
    set((s) => {
      const jobs = s.jobs.map((j) =>
        j.jobId === jobId ? { ...j, ...patch } : j,
      );
      return {
        jobs,
        batch: computeBatchProgress(s.batch.batchId, jobs),
      };
    }),

  markJobCancelled: (jobId) =>
    get().setJobStatus(jobId, {
      status: 'cancelled',
      progress: 0,
      message: '취소됨',
    }),

  replaceJobId: (oldJobId, newJobId) =>
    set((s) => {
      const jobs = s.jobs.map((j) =>
        j.jobId === oldJobId
          ? {
              ...j,
              jobId: newJobId,
              status: 'queued' as const,
              progress: 0,
              error: undefined,
              message: 'Queued',
            }
          : j,
      );
      return {
        jobs,
        batch: computeBatchProgress(s.batch.batchId, jobs),
      };
    }),

  getJob: (jobId) => get().jobs.find((j) => j.jobId === jobId),

  reset: () => set({ jobs: [], batch: emptyBatch(), uploadFiles: [] }),
}));
