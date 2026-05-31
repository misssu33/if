import 'server-only';

import type { BatchProgressResponse, JobProgress } from '@/types';
import { getBatchJobIds } from './batch-registry';
import { getJobProgress } from './progress';

/** 배치 내 모든 job 진행률 조회 */
export async function getBatchProgress(
  batchId: string,
): Promise<BatchProgressResponse> {
  const jobIds = await getBatchJobIds(batchId);
  const jobs: JobProgress[] = [];

  for (const jobId of jobIds) {
    const p =
      (await getJobProgress(jobId)) ??
      ({
        jobId,
        batchId,
        status: 'pending',
        progress: 0,
      } satisfies JobProgress);
    jobs.push({ ...p, batchId });
  }

  return { batchId, jobs };
}
