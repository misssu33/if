import 'server-only';

import { Queue } from 'bullmq';
import type { ConvertJobPayload } from '@/types';
import { getRedisConnection } from '@/lib/redis';
import { JOB_NAMES, MOTIONDOT_QUEUE_NAME } from './types';

let queueInstance: Queue<ConvertJobPayload> | null = null;

/** API 라우트용 BullMQ Queue (Worker는 worker/ 에서만) */
export function getConvertQueue(): Queue<ConvertJobPayload> {
  if (!queueInstance) {
    queueInstance = new Queue<ConvertJobPayload>(MOTIONDOT_QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return queueInstance;
}

export async function enqueueConvertJob(
  payload: ConvertJobPayload,
): Promise<string> {
  const job = await getConvertQueue().add(JOB_NAMES.CONVERT, payload, {
    jobId: payload.jobId,
  });
  return job.id ?? payload.jobId;
}
