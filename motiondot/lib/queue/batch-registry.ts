import { Redis } from 'ioredis';
import { getRedisHostConfig } from '@/lib/redis';
import { redisKeys } from './config';

export async function saveBatchJobIds(
  batchId: string,
  jobIds: string[],
): Promise<void> {
  const redis = new Redis(getRedisHostConfig());
  try {
    await redis.set(
      redisKeys.batchJobs(batchId),
      JSON.stringify(jobIds),
      'EX',
      86400,
    );
  } finally {
    redis.disconnect();
  }
}

export async function getBatchJobIds(batchId: string): Promise<string[]> {
  const redis = new Redis(getRedisHostConfig());
  try {
    const raw = await redis.get(redisKeys.batchJobs(batchId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } finally {
    redis.disconnect();
  }
}
