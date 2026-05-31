import type { BatchProgressResponse } from '@/types';

/** 배치 진행률 HTTP 조회 */
export async function fetchBatchProgress(
  batchId: string,
): Promise<BatchProgressResponse> {
  const res = await fetch(
    `/api/jobs/batch/progress?batchId=${encodeURIComponent(batchId)}`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch batch progress');
  }
  return res.json() as Promise<BatchProgressResponse>;
}
