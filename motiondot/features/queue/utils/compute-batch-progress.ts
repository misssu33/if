import type { BatchProgressState, ConversionJobItem } from '../types';

const emptyBatch = (): BatchProgressState => ({
  batchId: null,
  total: 0,
  completed: 0,
  failed: 0,
  cancelled: 0,
  processing: 0,
  queued: 0,
  pending: 0,
  progress: 0,
});

/** jobs 배열 → 배치 요약 진행률 */
export function computeBatchProgress(
  batchId: string | null,
  jobs: ConversionJobItem[],
): BatchProgressState {
  if (!batchId || jobs.length === 0) return emptyBatch();

  const counts = {
    completed: 0,
    failed: 0,
    cancelled: 0,
    processing: 0,
    queued: 0,
    pending: 0,
  };

  let progressSum = 0;

  for (const job of jobs) {
    progressSum += job.progress;
    switch (job.status) {
      case 'completed':
        counts.completed++;
        break;
      case 'failed':
        counts.failed++;
        break;
      case 'cancelled':
        counts.cancelled++;
        break;
      case 'processing':
        counts.processing++;
        break;
      case 'queued':
        counts.queued++;
        break;
      default:
        counts.pending++;
    }
  }

  const total = jobs.length;
  const terminal = counts.completed + counts.failed + counts.cancelled;
  const batchProgress =
    total > 0 ? Math.round(progressSum / total) : 0;

  return {
    batchId,
    total,
    ...counts,
    progress: terminal === total ? 100 : batchProgress,
  };
}
