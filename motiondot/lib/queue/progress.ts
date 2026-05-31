import 'server-only';

import { Redis } from 'ioredis';
import type { JobProgress } from '@/types';
import { getRedisHostConfig } from '@/lib/redis';

const PROGRESS_KEY = (jobId: string) => `motiondot:progress:${jobId}`;

/** Worker / API — Redis에 진행률 저장 */
export async function setJobProgress(progress: JobProgress): Promise<void> {
  const redis = new Redis(getRedisHostConfig());
  try {
    await redis.set(
      PROGRESS_KEY(progress.jobId),
      JSON.stringify(progress),
      'EX',
      86400,
    );
  } finally {
    redis.disconnect();
  }
}

export async function getJobProgress(
  jobId: string,
): Promise<JobProgress | null> {
  const redis = new Redis(getRedisHostConfig());
  try {
    const raw = await redis.get(PROGRESS_KEY(jobId));
    return raw ? (JSON.parse(raw) as JobProgress) : null;
  } finally {
    redis.disconnect();
  }
}
