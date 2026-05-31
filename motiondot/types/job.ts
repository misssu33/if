import type { OutputFormat } from './upload';

/** BullMQ 배치 작업 상태 */
export type JobStatus =
  | 'pending'
  | 'queued'
  | 'active'
  | 'completed'
  | 'failed';

/** 큐에 등록되는 변환 작업 페이로드 */
export interface ConvertJobPayload {
  jobId: string;
  inputPath: string;
  presetId: string;
  format: OutputFormat;
}

/** 실시간 진행률 (Redis / SSE) */
export interface JobProgress {
  jobId: string;
  status: JobStatus;
  progress: number;
  message?: string;
  outputPath?: string;
  error?: string;
}
