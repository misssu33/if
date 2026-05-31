import 'server-only';

import { Redis } from 'ioredis';
import { getRedisHostConfig } from '@/lib/redis';

const BATCH_JOBS_KEY = (batchId: string) => `motiondot:batch:${batchId}:jobs`;

export async function saveBatchJobIds(
  batchId: string,
  jobIds: string[],
): Promise<void> {
  const redis = new Redis(getRedisHostConfig());
  try {
    await redis.set(BATCH_JOBS_KEY(batchId), JSON.stringify(jobIds), 'EX', 86400);
  } finally {
    redis.disconnect();
  }
}

export async function getBatchJobIds(batchId: string): Promise<string[]> {
  const redis = new Redis(getRedisHostConfig());
  try {
    const raw = await redis.get(BATCH_JOBS_KEY(batchId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } finally {
    redis.disconnect();
  }
}
