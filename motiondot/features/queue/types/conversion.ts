import type { PresetQualityLevel } from '@/types';
import type { OutputFormat } from '@/types';

/** 파일별 변환 상태 */
export type ConversionFileStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

/** 큐에 등록된 단일 파일 작업 */
export interface ConversionJobItem {
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
  status: ConversionFileStatus;
  progress: number;
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
