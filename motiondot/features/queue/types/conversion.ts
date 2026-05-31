import type { PresetQualityLevel, UploadFileMeta } from '@/types';
import type { OutputFormat } from '@/types';

/** 파일별 변환·업로드 통합 상태 */
export type ConversionFileStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

/** 큐 파이프라인 단일 파일 작업 (Zustand 단일 소스) */
export interface ConversionJobItem {
  /** 업로드 UI 연결용 (있으면 업로드 단계 포함) */
  localId?: string;
  fileId: string;
  jobId: string;
  batchId: string;
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
  mediaKind?: UploadFileMeta['mediaKind'];
  status: ConversionFileStatus;
  /** 변환 진행률 (0–100) */
  progress: number;
  /** 업로드 진행률 (pending 단계, 0–100) */
  uploadProgress?: number;
  message?: string;
  error?: string;
  outputPath?: string;
}

/** 배치 전체 진행 요약 */
export interface BatchProgressState {
  batchId: string | null;
  total: number;
  completed: number;
  failed: number;
  cancelled: number;
  processing: number;
  queued: number;
  pending: number;
  progress: number;
}

export type PendingUploadInput = {
  localId: string;
  fileName: string;
  mediaKind?: UploadFileMeta['mediaKind'];
};

export type EnqueueJobMapping = {
  localId: string;
  fileId: string;
  jobId: string;
  presetId: string;
  format: OutputFormat;
  quality?: PresetQualityLevel;
  width: number;
  height: number;
  fps: number;
  loop?: boolean;
  maxFileSizeBytes?: number;
};
