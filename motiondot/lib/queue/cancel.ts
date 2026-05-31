import { Redis } from 'ioredis';
import { getExportQueue } from './client';
import { getRedisHostConfig } from '@/lib/redis';
import { redisKeys } from './config';
import { setJobProgress } from './progress';

export async function isJobCancelled(jobId: string): Promise<boolean> {
  const redis = new Redis(getRedisHostConfig());
  try {
    return (await redis.get(redisKeys.cancel(jobId))) === '1';
  } finally {
    redis.disconnect();
  }
}

export async function markJobCancelled(jobId: string): Promise<void> {
  const redis = new Redis(getRedisHostConfig());
  try {
    await redis.set(redisKeys.cancel(jobId), '1', 'EX', 86400);
  } finally {
    redis.disconnect();
  }
}

/** 대기/지연 job 제거 · 실행 중 job 취소 플래그 */
export async function cancelConvertJob(jobId: string): Promise<void> {
  const queue = getExportQueue();
  const job = await queue.getJob(jobId);

  await markJobCancelled(jobId);

  if (job) {
    const state = await job.getState();
    if (state === 'waiting' || state === 'delayed') {
      await job.remove();
    }
  }

  await setJobProgress({
    jobId,
    status: 'cancelled',
    progress: 0,
    message: 'Cancelled',
  });
}
