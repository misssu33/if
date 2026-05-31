import type { UploadFileMeta } from '@/types';

/** 업로드 큐 항목 상태 */
export type UploadQueueStatus =
  | 'queued'
  | 'uploading'
  | 'success'
  | 'error';

/** 드롭존 → API 업로드 큐 항목 */
export interface UploadQueueItem {
  localId: string;
  file: File;
  status: UploadQueueStatus;
  progress: number;
  error?: string;
  meta?: UploadFileMeta;
}
