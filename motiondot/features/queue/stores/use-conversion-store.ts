import { create } from 'zustand';
import type { OutputFormat, PresetQualityLevel, UploadFileMeta } from '@/types';
import type {
  BatchProgressState,
  ConversionJobItem,
  EnqueueJobMapping,
  PendingUploadInput,
} from '../types';
import { computeBatchProgress } from '../utils/compute-batch-progress';
import { mapServerStatus } from '../utils/map-server-status';

export interface RegisterBatchJobItem {
  fileId: string;
  fileName: string;
  inputPath: string;
  presetId: string;
  format: OutputFormat;
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
  items?: RegisterBatchJobItem[];
  files?: UploadFileMeta[];
  presetId: string;
  format: OutputFormat;
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
  registerPendingUploads: (inputs: PendingUploadInput[]) => void;
  setUploadProgress: (localId: string, progress: number, message?: string) => void;
  markUploadComplete: (localId: string, meta: UploadFileMeta) => void;
  failJobByLocalId: (localId: string, error: string) => void;
  completeImageOnlyJob: (localId: string) => void;
  attachQueueJobs: (
    batchId: string,
    mappings: EnqueueJobMapping[],
  ) => void;
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
  getJobByLocalId: (localId: string) => ConversionJobItem | undefined;
  removeJobByLocalId: (localId: string) => void;
  reset: () => void;
}

const emptyBatch = (): BatchProgressState => computeBatchProgress(null, []);

function pendingJobId(localId: string): string {
  return `pending:${localId}`;
}

export const useConversionStore = create<ConversionState>((set, get) => ({
  jobs: [],
  batch: emptyBatch(),

  registerPendingUploads: (inputs) => {
    set((s) => {
      const newJobs: ConversionJobItem[] = inputs.map((input) => ({
        localId: input.localId,
        fileId: input.localId,
        jobId: pendingJobId(input.localId),
        batchId: s.batch.batchId ?? '',
        fileName: input.fileName,
        inputPath: '',
        presetId: '',
        format: 'mp4',
        width: 0,
        height: 0,
        fps: 0,
        mediaKind: input.mediaKind,
        status: 'pending',
        progress: 0,
        uploadProgress: 0,
        message: '업로드 대기',
      }));
      const jobs = [...s.jobs, ...newJobs];
      return {
        jobs,
        batch: computeBatchProgress(s.batch.batchId, jobs),
      };
    });
  },

  setUploadProgress: (localId, progress, message) => {
    set((s) => {
      const jobs = s.jobs.map((j) =>
        j.localId === localId
          ? {
              ...j,
              status: 'pending' as const,
              uploadProgress: progress,
              progress: Math.min(40, Math.round(progress * 0.4)),
              message: message ?? `업로드 중 ${progress}%`,
            }
          : j,
      );
      return { jobs, batch: computeBatchProgress(s.batch.batchId, jobs) };
    });
  },

  markUploadComplete: (localId, meta) => {
    set((s) => {
      const jobs = s.jobs.map((j) =>
        j.localId === localId
          ? {
              ...j,
              fileId: meta.id,
              inputPath: meta.tempPath,
              fileName: meta.originalName,
              mediaKind: meta.mediaKind,
              uploadProgress: 100,
              progress: 40,
              message: '업로드 완료 · 큐 등록 중',
            }
          : j,
      );
      return { jobs, batch: computeBatchProgress(s.batch.batchId, jobs) };
    });
  },

  failJobByLocalId: (localId, error) => {
    set((s) => {
      const jobs = s.jobs.map((j) =>
        j.localId === localId
          ? { ...j, status: 'failed' as const, progress: 0, error, message: '업로드 실패' }
          : j,
      );
      return { jobs, batch: computeBatchProgress(s.batch.batchId, jobs) };
    });
  },

  completeImageOnlyJob: (localId) => {
    set((s) => {
      const jobs = s.jobs.map((j) =>
        j.localId === localId
          ? {
              ...j,
              status: 'completed' as const,
              progress: 100,
              uploadProgress: 100,
              message: '이미지 · 템플릿 미리보기용',
            }
          : j,
      );
      return { jobs, batch: computeBatchProgress(s.batch.batchId, jobs) };
    });
  },

  attachQueueJobs: (batchId, mappings) => {
    set((s) => {
      const byLocal = new Map(mappings.map((m) => [m.localId, m]));
      const expanded: ConversionJobItem[] = [];

      for (const job of s.jobs) {
        const m = job.localId ? byLocal.get(job.localId) : undefined;
        if (!m) {
          expanded.push(job);
          continue;
        }
        const match = mappings.filter((x) => x.localId === job.localId);
        if (match.length === 0) {
          expanded.push(job);
          continue;
        }
        const first = match[0];
        if (match.length === 1) {
          expanded.push({
            ...job,
            fileId: first.fileId,
            jobId: first.jobId,
            batchId,
            presetId: first.presetId ?? job.presetId,
            format: first.format ?? job.format,
            quality: first.quality,
            width: first.width ?? job.width,
            height: first.height ?? job.height,
            fps: first.fps ?? job.fps,
            loop: first.loop,
            maxFileSizeBytes: first.maxFileSizeBytes,
            status: 'queued',
            progress: 45,
            uploadProgress: 100,
            message: '큐 대기',
          });
        } else {
          expanded.push({
            ...job,
            fileId: first.fileId,
            jobId: first.jobId,
            batchId,
            presetId: first.presetId ?? job.presetId,
            format: first.format ?? job.format,
            quality: first.quality,
            width: first.width ?? job.width,
            height: first.height ?? job.height,
            fps: first.fps ?? job.fps,
            loop: first.loop,
            maxFileSizeBytes: first.maxFileSizeBytes,
            status: 'queued',
            progress: 45,
            uploadProgress: 100,
            message: '큐 대기',
          });
          for (let i = 1; i < match.length; i++) {
            const extra = match[i];
            expanded.push({
              ...job,
              localId: undefined,
              fileId: extra.fileId,
              jobId: extra.jobId,
              batchId,
              presetId: extra.presetId ?? job.presetId,
              format: extra.format!,
              quality: extra.quality,
              width: extra.width ?? job.width,
              height: extra.height ?? job.height,
              fps: extra.fps ?? job.fps,
              loop: extra.loop,
              maxFileSizeBytes: extra.maxFileSizeBytes,
              status: 'queued',
              progress: 45,
              message: '큐 대기',
            });
          }
        }
      }

      return {
        jobs: expanded,
        batch: computeBatchProgress(batchId, expanded),
      };
    });
  },

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
          progress: 45,
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
          mediaKind: file.mediaKind,
          status: 'queued' as const,
          progress: 45,
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
        const status = mapServerStatus(u.status);
        const convertProgress =
          status === 'completed'
            ? 100
            : status === 'processing'
              ? Math.max(50, Math.min(99, u.progress))
              : status === 'queued'
                ? 45
                : job.progress;
        return {
          ...job,
          status,
          progress: convertProgress,
          uploadProgress: 100,
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
      const jobs = s.jobs.map((j) => (j.jobId === jobId ? { ...j, ...patch } : j));
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
              progress: 45,
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

  getJobByLocalId: (localId) => get().jobs.find((j) => j.localId === localId),

  removeJobByLocalId: (localId) =>
    set((s) => {
      const jobs = s.jobs.filter((j) => j.localId !== localId);
      return {
        jobs,
        batch: computeBatchProgress(s.batch.batchId, jobs),
      };
    }),

  reset: () => set({ jobs: [], batch: emptyBatch() }),
}));
