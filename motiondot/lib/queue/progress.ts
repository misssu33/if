import { Redis } from 'ioredis';
import type { JobProgress } from '@/types';
import { getRedisHostConfig } from '@/lib/redis';
import { redisKeys } from './config';

/** Worker / API — Redis에 진행률 저장 */
export async function setJobProgress(progress: JobProgress): Promise<void> {
  const redis = new Redis(getRedisHostConfig());
  try {
    await redis.set(
      redisKeys.progress(progress.jobId),
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
    const raw = await redis.get(redisKeys.progress(jobId));
    return raw ? (JSON.parse(raw) as JobProgress) : null;
  } finally {
    redis.disconnect();
  }
}
