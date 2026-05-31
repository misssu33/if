/**
 * BullMQ 큐 이름·Redis 키·job 이름 단일 정의
 * - 큐 이름: 영문·숫자·언더스코어만 (콜론·하이픈 미사용)
 */
export const QUEUE_NAMES = {
  UPLOAD: 'upload_queue',
  EXPORT: 'export_queue',
  RENDER: 'render_queue',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/** 등록된 모든 BullMQ 큐 이름 */
export const ALL_QUEUE_NAMES: readonly QueueName[] = [
  QUEUE_NAMES.UPLOAD,
  QUEUE_NAMES.EXPORT,
  QUEUE_NAMES.RENDER,
];

export const JOB_NAMES = {
  UPLOAD: 'upload',
  CONVERT: 'convert',
  RENDER: 'render',
} as const;

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];

/** UI용 — BullMQ 등록 전 임시 jobId 접두사 */
export const PENDING_JOB_ID_PREFIX = 'pending_';

export function pendingJobId(localId: string): string {
  return `${PENDING_JOB_ID_PREFIX}${localId}`;
}

export function isPendingJobId(jobId: string): boolean {
  return jobId.startsWith(PENDING_JOB_ID_PREFIX);
}

/** Redis 보조 키 (BullMQ 큐 이름과 분리) */
export const redisKeys = {
  progress: (jobId: string) => `motiondot_progress_${jobId}`,
  batchJobs: (batchId: string) => `motiondot_batch_${batchId}_jobs`,
  cancel: (jobId: string) => `motiondot_cancel_${jobId}`,
} as const;
