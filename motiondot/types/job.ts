import type { ConvertQuality } from '@/lib/ffmpeg/types';
import type { OutputFormat } from './upload';

/** 서버/Redis 작업 상태 */
export type JobStatus =
  | 'pending'
  | 'queued'
  | 'active'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

/** 큐에 등록되는 단일 변환 작업 */
export interface ConvertJobPayload {
  jobId: string;
  batchId?: string;
  fileId?: string;
  inputPath: string;
  presetId: string;
  format: OutputFormat;
  quality?: ConvertQuality;
}

/** 배치 등록 요청 */
export interface BatchConvertRequest {
  batchId?: string;
  jobs: Omit<ConvertJobPayload, 'jobId' | 'batchId'>[];
}

/** 배치 등록 응답 */
export interface BatchConvertResponse {
  batchId: string;
  jobIds: string[];
}

/** 실시간 진행률 (Redis) */
export interface JobProgress {
  jobId: string;
  batchId?: string;
  status: JobStatus;
  progress: number;
  message?: string;
  outputPath?: string;
  error?: string;
}

/** 배치 진행 API 응답 */
export interface BatchProgressResponse {
  batchId: string;
  jobs: JobProgress[];
}

/** 배치 전체 진행 요약 */
export interface BatchProgress {
  batchId: string;
  total: number;
  completed: number;
  failed: number;
  active: number;
  progress: number;
}
